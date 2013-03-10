var fs = require('fs')
  , path = require('path')
  , colors = require('colors')
  , exec = require('child_process').exec
  , cl = require('cl')
  , S = require('string')
  , next = require('nextflow')

var me = {}
module.exports = me;

me.checkGitDirExistsSync= function() {
  if (!fs.existsSync('.git')) cl.exit(101, "Can not find the .git directory.")
}

me.getHeadSync = function() {
  return fs.readFileSync('.git/HEAD', 'utf8').toString()
}

me.getMarsBranches = function(callback) {
  var cmd = "git branch --list demo*"
  exec(cmd, function(err, stdout, stderr) {
    if (err) return callback(new Error(err))
    if (stderr) return callback(new Error(stderr))
    
    var branches = stdout.split('\n')
      , current = null;
    for (var i = 0; i < branches.length; ++i) {
      if (S(branches[i]).startsWith('*')) {
        branches[i] = branches[i].substring(1).trim(); //cut first '*'
        current = branches[i]
      }
    }

    callback(null, branches, current)
  })
}

me.getMarsData = function (HEAD, callback) {
  var cmd = "git log --tags --simplify-by-decoration --pretty='format:%d %ai | %s | %h'"
    , head = HEAD.substr(0,7)
    , current = -1

  exec(cmd, function(err, stdout, stderr) {
    if (err) return callback(err)
    
    var lines = stdout.split('\n')
      , R_NUM = /([^\?]*)mars(\d*)/ //(blah, omed%d, master)
      , R_DC =  /\)|\|/ // ) date | comment | hash
      , rows = []

    lines.forEach(function(line) {
      var data = line.match(R_NUM)
        , marsTag = {
          num: NaN, 
          commit: '', 
          desc: '', 
          date: '', 
          isCurrent: false,
          shortName: ''
        }  


      if (data && data.length >= 3) {
        marsTag.num = parseInt(data[2].trim(), 10)
        rows[marsTag.num] = marsTag

        data = line.split(R_DC)
        if (data.length >= 4) {
          marsTag.commit = data[3].trim()
          marsTag.description = data[2].trim()
          marsTag.date = data[1].trim()
          marsTag.isCurrent = (marsTag.commit == head)
          marsTag.shortName = marsTag.num + '-' + S(marsTag.description).slugify().truncate(25).s

          if (marsTag.isCurrent) current = marsTag.num;
        }
      }
    })
  
    callback(null, rows, current)
  })
}

me.goto = function(HEAD, newNum, callback) { //if newNum -1, this means last
  var resetCmd = 'git reset --hard'
    , checkoutCmd = 'git checkout mars'
    , newBranchCmd = 'git checkout -b demo/'
    , deleteBranchCmd = 'git branch -d '

  newNum = ~~newNum

  var marsData = []
    , currentNum = -1
    , branches = []
    , currentBranch = null

  var flow = {}
  next(flow = {
    ERROR: function(err) {
      callback(err)
    },
    getMarsData: function() {
      me.getMarsData(HEAD, flow.next)
    },
    getMarsBranches: function(err, md, cn) {
      marsData = md, currentNum = cn
      if (marsData.length === 0) return callback(new Error('No mars tags found.'))

      me.getMarsBranches(flow.next)
    },
    reset: function(b, curb) {
      branches = b, currentBranch = curb

      exec(resetCmd, flow.next)
    },
    checkout: function() {
      if (newNum === -1) newNum = marsData.length - 1;
      exec(checkoutCmd + newNum, flow.next)
    },
    done: function() {
      callback(null, marsData[currentNum], marsData[newNum])
    }
  })
}








var fs = require('fs')
  , path = require('path')
  , colors = require('colors')
  , exec = require('child_process').exec
  , cl = require('cl')
  , S = require('string')
  , next = require('nextflow')
  , util = require('util')

var me = {}
module.exports = me;

me.checkGitDirExistsSync= function() {
  if (!fs.existsSync('.git')) cl.exit(101, "Can not find the .git directory.")
}

me.getHeadSync = function() {
  var data = fs.readFileSync('.git/HEAD', 'utf8').toString()
  if (S(data).startsWith('ref:')) { //a branch is checked out
    var ref = data.split('ref:')[1].trim()
    data = fs.readFileSync(path.join('.git/', ref), 'utf8').toString()
    return data;
  } else //no branch
    return data;
}

me.getHeadObjSync = function() {
  var HEAD = me.getHeadSync()
    , head = head = HEAD.substr(0,7)
  return {HEAD: HEAD, head: head}
}

me.getMarsBranches = function(callback) {
  var cmd = "git branch --list demo*"
  exec(cmd, function(err, stdout, stderr) {
    if (err) return callback(new Error(err))
    if (stderr) return callback(new Error(stderr))
    
    var branches = stdout.trim().split('\n')
      , current = null;
    for (var i = 0; i < branches.length; ++i) {
      if (S(branches[i]).startsWith('*')) {
        branches[i] = branches[i].substring(1).trim(); //cut first '*'
        current = branches[i]
      } else
        branches[i] = branches[i].trim()
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
          marsTag.shortName = marsTag.num + '-' + S(marsTag.description).slugify().truncate(25).replaceAll('.','').s

          if (marsTag.isCurrent) current = marsTag.num;
        }
      }
    })
  
    callback(null, rows, current)
  })
}

me.goto = function(HEAD, cmdOrNum, callback) { 
  var resetCmd = 'git reset --hard'
    , checkoutCmd = 'git checkout mars'
    , newBranchCmd = 'git checkout -b demo/'
    , deleteBranchCmd = 'git branch -D '

  var marsData = []
    , currentNum = -1
    , branches = []
    , currentBranch = null
    , newNum = 0

  //call after you get marsData
  function setNewNum(callback) {
    if (typeof cmdOrNum === 'number') {
      newNum = cmdOrNum

      if (newNum >= marsData.length) 
        callback(new Error(util.format("goto %d failed, mars%d does not exist", newNum, newNum)))
      if (newNum < 0)
        callback(new Error("Can not goto a negative index."))
      if (newNum === currentNum)
        callback("Already on " + marsData[newNum].shortName.bold.green)
    }
    else if (typeof cmdOrNum === 'string') {
      switch (cmdOrNum) {
        case 'start': 
          newNum = 0; break;
        case 'prev': 
        case 'previous': 
          newNum = currentNum - 1; break;
        case 'next': 
          newNum = currentNum + 1; break;
        case 'last':
          newNum = marsData.length - 1; break;
      }

      if (newNum >= marsData.length)
        newNum = marsData.length - 1
      if (newNum < 0)
        newNum = 0
    }

    if (newNum === currentNum)
      callback(new Error("Already on " + marsData[newNum].shortName.bold.green))
    else
      callback(null)
  }

  var flow = {}
  next(flow = {
    ERROR: function(err) {
      callback(err)
    },
    getMarsData: function() {
      me.getMarsData(HEAD, flow.next)
    },
    getMarsBranches: function(err, md, cn) {
      marsData = md; currentNum = cn
      if (marsData.length === 0) return callback(new Error('No mars tags found.'))
      
      setNewNum(function(err) {
        if (err) return callback(err)
        me.getMarsBranches(flow.next)
      })
    },
    reset: function(err, b, curb) {
      branches = b; currentBranch = curb

      exec(resetCmd, flow.next)
    },
    checkout: function() {
      exec(checkoutCmd + newNum, flow.next)
    },
    createNewBranch: function() {
      exec(newBranchCmd + marsData[newNum].shortName, flow.next)
    },
    deleteOldBranch: function() {
      if (currentBranch)
        exec(deleteBranchCmd + currentBranch, flow.next)
      else
        flow.next()
    },
    done: function() {
      callback(null, marsData[currentNum], marsData[newNum])
    }
  })
}








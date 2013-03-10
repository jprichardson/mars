var fs = require('fs')
  , path = require('path')
  , colors = require('colors')
  , exec = require('child_process').exec
  , cl = require('cl')


var me = {}
module.exports = me;

me.checkGitDirExistsSync= function() {
  if (!fs.existsSync('.git')) cl.exit(101, "Can not find the .git directory.")
}

me.getHeadSync = function() {
  return fs.readFileSync('.git/HEAD', 'utf8').toString()
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
        , marsTag = {num: NaN, commit: '', desc: '', date: '', isCurrent: false}  


      if (data && data.length >= 3) {
        marsTag.num = parseInt(data[2].trim(), 10)
        rows[marsTag.num] = marsTag

        data = line.split(R_DC)
        if (data.length >= 4) {
          marsTag.commit = data[3].trim()
          marsTag.description = data[2].trim()
          marsTag.date = data[1].trim()
          marsTag.isCurrent = (marsTag.commit == head)

          if (marsTag.isCurrent) current = marsTag.num;
        }
      }
    })
  
    callback(null, rows, current)
  })
}
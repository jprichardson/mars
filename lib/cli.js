var program = require('commander')
  , util = require('util')
  , mars = require('./mars')
  , cl = require('cl')
  , colors = require('colors')

var me = {}
module.exports = me;

me.init = function(progPurpose, usageParam) {
  mars.checkGitDirExistsSync()

  var usage = program.usage()
  usage += [
    util.format(" %s\n", usageParam || ' '),
    "\n",
    util.format("  %s", progPurpose)
  ].join('')

  program.usage(usage)

  program.version(require('../package').version)
    .parse(process.argv)

  if (usageParam && process.argv.length <= 2) {
    program.outputHelp()
    process.exit(101)
  }

  return program
}

me.nav = function(direction) {
  if (typeof direction === 'string') {
    me.init('Move to ' + direction)
  } else {
    me.init('Move to [num]', '[num]')
  }

  var hobj = mars.getHeadObjSync()

  mars.goto(hobj.HEAD, direction, function(err, prev, cur) {
    if (err) cl.exit(100, err)
    console.log('Moved to %s: %s', direction, cur.shortName.bold.green)
  })
}

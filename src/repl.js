var repl = require('repl');

var parse = require('./parser.js').parse;
var interpret = require('./interpreter.js');
var initialEnv = require('./initialEnv.js');

repl.start({
  eval: function (cmd, context, filename, callback) {
    try {
      let ast = parse(cmd);
      let val;
      for (let i = 0; i < ast.length; i++) {
        val = interpret(ast[i], initialEnv);
      }
      callback(null, val);
    } catch (e) {
      callback(e);
    }
  },
  ignoreUndefined: true
});

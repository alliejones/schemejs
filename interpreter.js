var initialEnv = require('./initialEnv.js')

var lookup = function (env, v) {
  if (env.bindings && env.bindings.hasOwnProperty(v))
    return env.bindings[v];
  else if (env.outer)
    return lookup(env.outer, v);
  else {
    throw new Error(`Variable ${v} is not defined.`);
    }
};

var update = function (env, v, val) {
  if (env.bindings && env.bindings.hasOwnProperty(v))
    env.bindings[v] = val;
  else if (env.outer)
    update(env.outer, v, val);
  else
    throw new Error(`Variable ${v} is not defined.`);
};

var addBinding = function (env, v, val) {
  env.bindings[v] = val;
};

function evl (expr, env = initialEnv) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }

  if (typeof expr === 'string') {
    return lookup(env, expr);
  }

  // Look at head of list for operation
  var op = expr[0];
  var val, val2, list;
  switch (op) {

    case 'quote':
      return expr[1];

    case 'define':
      env[expr[1]] = evl(expr[2], env);
      return 0;

    case 'let':
      var newEnv = { bindings: {}, outer: env };
      var decl = expr[1];
      for (var i = 0; i < decl.length; i++) {
        let [ k, v ] = decl[i];
        newEnv.bindings[k] = evl(v, env);
      }
      return evl(expr[2], newEnv);

    case 'set!':
      update(env, expr[1], evl(expr[2], env));
      return 0;

    case 'begin':
      for (var i = 1; i < expr.length; i++) {
        val = evl(expr[i], env);
      }
      return val;

    case 'if':
      val = evl(expr[1], env);
      // everthing in Scheme is truthy but #f
      if (val === '#f')
        return evl(expr[3], env);
      else
        return evl(expr[2], env);

    case 'lambda':
      var args = expr.slice(1, -1);
      return function () {
        var argVals = [].slice.apply(arguments);
        var newEnv = { bindings: {}, outer: env };
        for (var i = 0; i < args.length; i++) {
          newEnv.bindings[args[i]] = argVals[i];
        }

        return evl(expr[expr.length - 1], newEnv);
      };

    default:
      var func = evl(expr[0], env);
      var args = expr.slice(1);
      args = args.map(a => evl(a, env));
      return func.apply(null, args);
  }
};

module.exports = evl;

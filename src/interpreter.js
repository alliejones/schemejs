var initialEnv = require('./initialEnv.js')

var evl = function evl (expr, env = initialEnv) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;

  } else if (typeof expr === 'string') {
    return lookup(env, expr);

  } else if (specialForms.hasOwnProperty(expr[0])) {
    let args = [env].concat(expr.slice(1));
    return specialForms[expr[0]].apply(null, args);

  } else {
    // user-defined function
    let func = evl(expr[0], env);
    let args = expr.slice(1);
    args = args.map(a => evl(a, env));
    return func.apply(null, args);
  }
};


var specialForms = {
  quote: function (env, expr) {
    return expr;
  },

  define: function (env, name, val) {
    env.bindings[name] = evl(val, env);
    return 0;
  },

  // ES5 indeed allows reserved words as property names
  let: function (env, decl, body) {
    var newEnv = { bindings: {}, outer: env };
    for (var i = 0; i < decl.length; i++) {
      let [ k, v ] = decl[i];
      newEnv.bindings[k] = evl(v, env);
    }
    return evl(body, newEnv);
  },

  'set!': function (env, name, val) {
    update(env, name, evl(val, env));
    return 0;
  },

  begin: function (env, ...exprs) {
    var val;
    for (var i = 0; i < exprs.length; i++) {
      val = evl(exprs[i], env);
    }
    return val;
  },

  if: function (env, cond, whenTrue, whenFalse) {
    // everthing in Scheme is truthy but #f
    if (evl(cond, env) === '#f')
      return evl(whenFalse, env);
    else
      return evl(whenTrue, env);
  },

  lambda: function (env, ...args) {
    var argNames = args;
    var body = argNames.pop();
    return function () {
      var argVals = [].slice.apply(arguments);
      var newEnv = { bindings: {}, outer: env };
      for (var i = 0; i < argNames.length; i++) {
        newEnv.bindings[argNames[i]] = evl(argVals[i], env);
      }
      return evl(body, newEnv);
    };
  }
};


var lookup = function (env, v) {
  if (env.bindings && env.bindings.hasOwnProperty(v))
    return env.bindings[v];
  else if (env.outer)
    return lookup(env.outer, v);
  else
    throw new Error(`Variable ${v} is not defined.`);
};


var update = function (env, v, val) {
  if (env.bindings && env.bindings.hasOwnProperty(v))
    env.bindings[v] = val;
  else if (env.outer)
    update(env.outer, v, val);
  else
    throw new Error(`Value ${v} is not defined.`);
};

module.exports = evl;

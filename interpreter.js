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
    throw new Error(`Variable ${v} is not defined.`);
};

function evl (expr, env) {
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
    case '+':
      return evl(expr[1], env) + evl(expr[2], env);

    case '-':
      return evl(expr[1], env) - evl(expr[2], env);

    case '*':
      return evl(expr[1], env) * evl(expr[2], env);

    case '/':
      return evl(expr[1], env) / evl(expr[2], env);

    case '=':
      val = (evl(expr[1], env) === evl(expr[2], env));
      return val ? '#t' : '#f';

    case '>':
      val = (evl(expr[1], env) > evl(expr[2], env));
      return val ? '#t' : '#f';

    case '<':
      val = (evl(expr[1], env) < evl(expr[2], env));
      return val ? '#t' : '#f';

    case 'quote':
      return expr[1];

    case 'define':
      env[expr[1]] = evl(expr[2], env);
      return 0;

    case 'let-one':
      var newEnv = { bindings: {}, outer: env };
      newEnv.bindings[expr[1]] = evl(expr[2], env);
      return evl(expr[3], newEnv);

    case 'set!':
      update(env, expr[1], evl(expr[2], env));
      return 0;

    case 'begin':
      for (var i = 1; i < expr.length; i++) {
        val = evl(expr[i], env);
      }
      return val;

    case 'cons':
      val = evl(expr[1], env);
      list = evl(expr[2], env);
      return [val].concat(list);

    case 'car':
      list = evl(expr[1], env);
      val = list.shift();
      return val;

    case 'cdr':
      list = evl(expr[1], env);
      list.shift();
      return list;

    case 'if':
      val = evl(expr[1], env);
      if (expr[1] === '#t')
        return evl(expr[2], env);
      else if (val === '#f')
        return evl(expr[3], env);
  }
};

module.exports = evl;

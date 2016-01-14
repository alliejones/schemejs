function evalScheem (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }

  if (typeof expr === 'string') {
    return env[expr];
  }

  // Look at head of list for operation
  var op = expr[0];
  var val, val2, list;
  switch (op) {
    case '+':
      return evalScheem(expr[1], env) + evalScheem(expr[2], env);

    case '-':
      return evalScheem(expr[1], env) - evalScheem(expr[2], env);

    case '*':
      return evalScheem(expr[1], env) * evalScheem(expr[2], env);

    case '/':
      return evalScheem(expr[1], env) / evalScheem(expr[2], env);

    case '=':
      val = (evalScheem(expr[1], env) === evalScheem(expr[2], env));
      return val ? '#t' : '#f';

    case '>':
      val = (evalScheem(expr[1], env) > evalScheem(expr[2], env));
      return val ? '#t' : '#f';

    case '<':
      val = (evalScheem(expr[1], env) < evalScheem(expr[2], env));
      return val ? '#t' : '#f';

    case 'quote':
      return expr[1];

    case 'define':
      env[expr[1]] = evalScheem(expr[2], env);
      return 0;

    case 'set!':
      if (!env.hasOwnProperty(expr[1]))
        throw new Error('Variable '+expr[1]+' is not defined');

      env[expr[1]] = evalScheem(expr[2], env);
      return 0;

    case 'begin':
      for (var i = 1; i < expr.length; i++) {
        val = evalScheem(expr[i], env);
      }
      return val;

    case 'cons':
      val = evalScheem(expr[1], {});
      list = evalScheem(expr[2], {});
      return [val].concat(list);

    case 'car':
      list = evalScheem(expr[1], {});
      val = list.shift();
      return val;

    case 'cdr':
      list = evalScheem(expr[1], {});
      list.shift();
      return list;

    case 'if':
      val = evalScheem(expr[1], env);
      if (expr[1] === '#t')
        return evalScheem(expr[2], env);
      else if (val === '#f')
        return evalScheem(expr[3], env);
  }
};

module.exports = evalScheem;

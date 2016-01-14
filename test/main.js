var assert = require('chai').assert;

var evalScheem = require('../interpreter.js');

var eq = function(ast, val) {
  assert.deepEqual(evalScheem(ast, {}), val);
};

/*
begin
=, <, cons, car, cdr
if
*/

suite('begin', function() {
  test('number list', function() {
    assert.deepEqual(evalScheem(['begin', 1, 2, 3], {}), 3);
  });

  test('expression', function() {
    assert.deepEqual(evalScheem(['begin', ['+', 2, 2]], {}), 4);
  });

  test('variable list', function() {
    assert.deepEqual(evalScheem(['begin', 'x', 'y', 'x'], {x:1, y:2}), 1);
  });

  test('set! list', function() {
    assert.deepEqual(evalScheem(['begin', ['set!', 'x', 5],
        ['set!', 'x', ['+', 'y', 'x']], 'x'], {x:1, y:2}), 7);
  });
});

suite('variables', function() {
  var env;
  setup(function() {
    env = { foo: 0 };
  });

  test('define', function() {
    evalScheem(['define', 'x', 2], env);
    assert.equal(env.x, 2);
  });

  test('can\'t set! undefined variable', function() {
    assert.throws(function() {
      evalScheem(['set!', 'bar', 1], env);
    }, 'is not defined');
  });

  test('set! literal', function() {
    evalScheem(['set!', 'foo', 3], env);
    assert.deepEqual(env, { foo: 3 });
  });

  test('set! expression', function() {
    evalScheem(['set!', 'foo', ['+', 5, 2]], env);
    assert.deepEqual(env, { foo: 7 });
  });

  test('retrieve expression', function() {
    evalScheem(['set!', 'foo', ['+', 5, 2]], env);
    assert.deepEqual(evalScheem('foo', env), 7);
  });

});

suite('numbers', function() {
  test('evaluation', function() {
    assert.deepEqual(
      evalScheem(3),
      3
    );
  });
});

suite('quote', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['quote', 3], {}),
      3
    );
  });
  test('an atom', function() {
    assert.deepEqual(
      evalScheem(['quote', 'dog'], {}),
      'dog'
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['quote', [1, 2, 3]], {}),
      [1, 2, 3]
    );
  });
});

suite('cons', function() {
  test('literal', function() {
    assert.deepEqual(
      evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
      [1, 2, 3]
    );
  });

  test('list', function() {
    assert.deepEqual(
      evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
      [[1, 2], 3, 4]);
  });

});

suite('car', function() {
  test('list', function() {
    assert.deepEqual(
      evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
      [1, 2]
    );
  });
});

suite('cdr', function() {
  test('list', function() {
    assert.deepEqual(
      evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
      [3, 4]
    );
  });
});

suite('if', function() {
  test('boolean literal', function() {
    var env = { foo: 1 };
    evalScheem(['if', '#t', ['set!', 'foo', 2], ['set!', 'foo', 3]], env);
    assert.equal(env.foo, 2);
  });

  test('expression', function() {
    var env = { foo: 1 };
    evalScheem(['if', ['=', 'foo', 5], ['set!', 'foo', 2], ['set!', 'foo', 3]], env);
    assert.equal(env.foo, 3);
  });
});

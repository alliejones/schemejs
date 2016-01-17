var assert = require('chai').assert;

var evl = require('../src/interpreter.js');
var initialEnv = require('../src/initialEnv.js');

var eq = function(ast, val) {
  assert.deepEqual(evl(ast), val);
};

suite('begin', function() {
  test('number list', function() {
    assert.deepEqual(evl(['begin', 1, 2, 3]), 3);
  });

  test('expression', function() {
    assert.deepEqual(evl(['begin', ['+', 2, 2]]), 4);
  });

  test('variable list', function() {
    assert.deepEqual(evl(['begin', 'x', 'y', 'x'], {bindings: { x:1, y:2}, outer: initialEnv }), 1);
  });

  test('set! list', function() {
    assert.deepEqual(evl(['begin', ['set!', 'x', 5],
        ['set!', 'x', ['+', 'y', 'x']], 'x'], {bindings: {x:1, y:2}, outer: initialEnv }), 7);
  });
});

suite('variables', function() {
  var env;
  setup(function() {
    env = { bindings: { foo: 0 }, outer: initialEnv };
  });

  test('define', function() {
    evl(['define', 'x', 2], env);
    assert.equal(env.bindings.x, 2);
  });

  test('can\'t set! undefined variable', function() {
    assert.throws(function() {
      evl(['set!', 'bar', 1], env);
    }, 'is not defined');
  });

  test('set! literal', function() {
    evl(['set!', 'foo', 3], env);
    assert.deepEqual(env.bindings, { foo: 3 });
  });

  test('set! expression', function() {
    evl(['set!', 'foo', ['+', 5, 2]], env);
    assert.deepEqual(env.bindings, { foo: 7 });
  });

  test('retrieve expression', function() {
    evl(['set!', 'foo', ['+', 5, 2]], env);
    assert.deepEqual(evl('foo', env), 7);
  });

});

suite('numbers', function() {
  test('evaluation', function() {
    assert.deepEqual(
      evl(3),
      3
    );
  });
});

suite('quote', function() {
  test('a number', function() {
    assert.deepEqual(
      evl(['quote', 3]),
      3
    );
  });
  test('an atom', function() {
    assert.deepEqual(
      evl(['quote', 'dog']),
      'dog'
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evl(['quote', [1, 2, 3]]),
      [1, 2, 3]
    );
  });
});

suite('cons', function() {
  test('literal', function() {
    assert.deepEqual(
      evl(['cons', 1, ['quote', [2, 3]]]),
      [1, 2, 3]
    );
  });

  test('list', function() {
    assert.deepEqual(
      evl(['cons', ['quote', [1, 2]], ['quote', [3, 4]]]),
      [[1, 2], 3, 4]);
  });

});

suite('car', function() {
  test('list', function() {
    assert.deepEqual(
      evl(['car', ['quote', [[1, 2], 3, 4]]]),
      [1, 2]
    );
  });
});

suite('cdr', function() {
  test('list', function() {
    assert.deepEqual(
      evl(['cdr', ['quote', [[1, 2], 3, 4]]]),
      [3, 4]
    );
  });
});

suite('if', function() {
  test('boolean literal', function() {
    var env = { bindings: { foo: 1 }, outer: initialEnv };
    evl(['if', '#t', ['set!', 'foo', 2], ['set!', 'foo', 3]], env);
    assert.equal(env.bindings.foo, 2);
  });

  test('expression', function() {
    var env = { bindings: { foo: 1 }, outer: initialEnv };
    evl(['if', ['=', 'foo', 5], ['set!', 'foo', 2], ['set!', 'foo', 3]], env);
    assert.equal(env.bindings.foo, 3);
  });
});

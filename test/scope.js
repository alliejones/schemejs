var assert = require('chai').assert;

var evl = require('../interpreter.js');

suite('let', function() {
  var env1, env2, env3;

  setup(function() {
    env1 = { bindings: {'x': 19}, outer: { } };
    env2 = { bindings: {'y': 16}, outer: env1 };
    env3 = { bindings: {'x': 2}, outer: env2 };
  });

  test('computed value', function() {
    assert.equal(evl(['let-one', 'x', ['+', 2, 2], 'x'], env3), 4);
    // original environment should not change
    assert.deepEqual(env3, { bindings: {'x': 2}, outer: env2 });
  });

  test('inner reference', function() {
    assert.equal(evl(['let-one', 'z', 7, 'z'], env3), 7);
  });

  test('outer reference', function() {
    assert.equal(evl(['let-one', 'x', 7, 'y'], env3), 16);
  });

  test('shadowing', function() {
    assert.equal(evl(['let-one', 'x', 7, 'x'], env3), 7);
    assert.equal(env1.bindings.x, 19);
  });
});
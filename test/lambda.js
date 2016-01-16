var assert = require('chai').assert;

var evl = require('../interpreter.js');

suite('lambda', function() {
  test('return argument', function() {
    assert.equal(evl([['lambda', 'x', 'x'], 5]), 5);
  });

  test('multiple arguments', function() {
    assert.equal(evl([['lambda', 'x', 'y', 'z', ['*', ['+', 'x', 'y'], 'z']], 5, 2, 2]), 14);
  });

  test('increment', function() {
    assert.equal(evl([['lambda', 'x', ['+', 'x', 1]], 5]), 6);
  });

  test('nested functions', function() {
    assert.equal(evl([[['lambda', 'x',
                        ['lambda', 'y',
                         ['+', 'x', 'y']]], 5], 3]),
                 8);
  });

  test('nested functions with same arg names', function() {
    assert.equal(evl([[['lambda', 'x',
                        ['lambda', 'x',
                         ['+', 'x', 'x']]], 5], 3]),
                 6);
  });
});

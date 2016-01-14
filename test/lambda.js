var assert = require('chai').assert;

var evl = require('../interpreter.js');

suite('lambda', function() {
  test('return argument', function() {
    assert.equal(evl([['lambda-one', 'x', 'x'], 5], {}), 5);
  });

  test('increment', function() {
    assert.equal(evl([['lambda-one', 'x', ['+', 'x', 1]], 5], {}), 6);
  });

  test('nested functions', function() {
    assert.equal(evl([[['lambda-one', 'x',
                        ['lambda-one', 'y',
                         ['+', 'x', 'y']]], 5], 3], {}),
                 8);
  });

  test('nested functions with same arg names', function() {
    assert.equal(evl([[['lambda-one', 'x',
                        ['lambda-one', 'x',
                         ['+', 'x', 'x']]], 5], 3], {}),
                 6);
  });
});

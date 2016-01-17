var assert = require('chai').assert;

var evl = require('../src/interpreter.js');

var eq = function(ast, val) {
  assert.deepEqual(evl(ast), val);
};

suite('equality', function() {
  test('numbers', function() {
    eq(['=', 5, 5], '#t');
    eq(['=', 5, 10], '#f');
  });

  test('expressions', function() {
    eq(['=', ['*', 5, 1], ['/', 10, 2]], '#t');
    eq(['=', ['*', 5, 1], ['/', 10, 5]], '#f');
  });
});

suite('comparing', function() {
  test('greater than', function() {
    eq(['>', 6, 5], '#t');
    eq(['>', 4, 5], '#f');
  });

  test('less than', function() {
    eq(['<', 6, 5], '#f');
    eq(['<', 4, 5], '#t');
  });

  test('expressions', function() {
    eq(['<', ['*', 5, 1], ['/', 10, 2]], '#f');
  });
});


suite('add', function() {
  test('two numbers', function() {
    eq(
      ['+', 3, 5],
      8
    );
  });
  test('a number and an expression', function() {
    eq(
      ['+', 3, ['+', 2, 2]],
      7
    );
  });
  test('two expressions', function() {
    eq(
      ['+', ['+', 1, 1], ['+', 2, 2]],
      6
    );
  });
});

suite('subtract', function() {
  test('two numbers', function() {
    eq(
      ['-', 3, 5],
      -2
    );
  });
  test('a number and an expression', function() {
    eq(
      ['-', 3, ['-', 2, 2]],
      3
    );
  });
  test('two expressions', function() {
    eq(
      ['-', ['-', 5, 1], ['-', 6, 2]],
      0
    );
  });
});

suite('multiply', function() {
  test('two numbers', function() {
    eq(
      ['*', 3, 5],
      15
    );
  });
  test('a number and an expression', function() {
    eq(
      ['*', 3, ['*', 2, 2]],
      12
    );
  });
  test('two expressions', function() {
    eq(
      ['*', ['*', 5, 1], ['*', 6, 2]],
      60
    );
  });
});

suite('divide', function() {
  test('two numbers', function() {
    eq(
      ['/', 6, 2],
      3
    );
  });
  test('a number and an expression', function() {
    eq(
      ['/', ['/', 12, 2], 3],
      2
    );
  });
  test('two expressions', function() {
    eq(
      ['/', ['/', 30, 2], ['/', 6, 2]],
      5
    );
  });
});

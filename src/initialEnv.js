var initialEnv = {
  bindings: {
    '#t': '#t',

    '#f': '#f',

    '+': function(a, b) {
      return a + b;
    },

    '-': function(a, b) {
      return a - b;
    },

    '*': function(a, b) {
      return a * b;
    },

    '/': function(a, b) {
      return a / b;
    },

    '=': function(a, b) {
      return a === b ? '#t' : '#f';
    },

    '>': function(a, b) {
      return a > b ? '#t' : '#f';
    },

    '<': function(a, b) {
      return a < b ? '#t' : '#f';
    },

    'cons': function(val, list) {
      return [val].concat(list);
    },

    'car': function (list) {
      return list[0];
    },

    'cdr': function (list) {
      list = list.slice(0);
      list.shift();
      return list;
    }
  }
};

module.exports = initialEnv;

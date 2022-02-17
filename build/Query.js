'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Query;

var _types = require('./types');

function Query(name, constructor) {
  constructor = constructor || name;
  name = typeof name === 'string' ? name : '_query';

  if (!(0, _types.isFunction)(constructor)) {
    throw new Error('Expected a function as first or second argument to Query');
  }

  function _query(...args) {
    if (!(this instanceof _query)) return new _query(...args);
    this.arguments = args;
    this.displayName = this.name = name;
    this[Symbol.toStringTag] = name;

    const gen = constructor.apply(this, args);

    if ((0, _types.isFunction)(gen)) {
      this[Symbol.iterator] = (...iterArgs) => gen.apply(this, iterArgs)[Symbol.iterator](...iterArgs);
    } else if ((0, _types.isObject)(gen) && (0, _types.isFunction)(gen[Symbol.iterator])) {
      this[Symbol.iterator] = (...iterArgs) => gen[Symbol.iterator](...iterArgs);
    } else {
      throw new Error('Query\'s constructor function should return a generator or iterator');
    }
  }

  _query.displayName = name;

  return _query;
}
module.exports = exports.default;
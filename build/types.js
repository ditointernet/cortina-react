'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isPromise = isPromise;
exports.isIterator = isIterator;
exports.hasIterator = hasIterator;
exports.hasAsyncIterator = hasAsyncIterator;
exports.getIterator = getIterator;
/* istanbul ignore file */
function isFunction(fn) {
  return fn && typeof fn === 'function';
}

function isObject(obj) {
  return obj && typeof obj === 'object';
}

function isPromise(p) {
  return p && isFunction(p.then);
}

function isIterator(iter) {
  return iter && isFunction(iter.next);
}

function hasIterator(gen) {
  return gen && isFunction(gen[Symbol.iterator]);
}

function hasAsyncIterator(gen) {
  return gen && isFunction(gen[Symbol.asyncIterator]);
}

function getIterator(gen, ...args) {
  if (isFunction(gen)) {
    gen = gen(...args);
  }

  if (hasIterator(gen)) {
    return gen[Symbol.iterator]();
  } else if (hasAsyncIterator(gen)) {
    return gen[Symbol.asyncIterator]();
  } else if (isIterator(gen)) {
    return gen;
  }

  return null;
}
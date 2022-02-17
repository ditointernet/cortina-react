'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = exports.race = undefined;
exports.delay = delay;
exports.pipe = pipe;
exports.compose = compose;
exports.step = step;
exports.after = after;
exports.loop = loop;
exports.loopWhile = loopWhile;
exports.map = map;
exports.filter = filter;

var _process = require('./process');

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function pipe(...fns) {
  return function* (arg) {
    let ret = arg;
    for (let fn of fns) {
      ret = yield fn(ret);
    }
    return ret;
  };
}

function* compose(...fns) {
  yield* pipe(fns.reverse());
}

const race = exports.race = (0, _Query2.default)('race', function (iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* race() {
    const promises = this.iterators.map(iter => (0, _process.runProcess)(iter, handler || this.handler));
    const result = yield Promise.race(promises);
    promises.forEach(p => p.cancel());
    return result;
  };
});

const all = exports.all = (0, _Query2.default)('all', function (iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* all() {
    return yield Promise.all(this.iterators.map(iter => (0, _process.runProcess)(iter, handler || this.handler)));
  };
});

function step(iterator, ...args) {
  var _iterator$next = iterator.next(...args);

  const value = _iterator$next.value,
        done = _iterator$next.done;

  return { value, iterator, done };
}

function* after(iter, gen) {
  const res = yield* iter;
  const iter2 = gen(res);
  if ((0, _types.hasIterator)(iter2)) {
    yield* iter2;
  } else {
    return iter2;
  }
}

function loop(fn) {
  return arg => loopWhile(() => true, fn)(arg);
}

function loopWhile(cond, fn) {
  return function* loopWhile(arg) {
    let ret = arg;
    do {
      ret = yield* fn(ret);
    } while (cond(ret));
    return ret;
  };
}

function* map(f, iter) {
  let result,
      input,
      index = 0;
  iter = (0, _types.getIterator)(iter);

  while (!(result = iter.next(input)).done) {
    input = yield f(result.value, index++);
  }

  return f(result.value, index++);
}

function* filter(f, iter) {
  let result,
      input,
      index = 0;
  iter = (0, _types.getIterator)(iter);

  while (!(result = iter.next(input)).done) {
    if (f(result.value, index++)) input = yield result.value;
  }

  if (f(result.value, index++)) return result.value;
}
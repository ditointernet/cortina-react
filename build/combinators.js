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

var Process = _interopRequireWildcard(_process);

var _Query2 = require('./Query');

var _Query = _interopRequireWildcard(_Query2);

var _types = require('./types');

var Types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const runProcess = Process.runProcess;

const Query = _Query.default;
const getIterator = Types.getIterator,
      hasIterator = Types.hasIterator;
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

const race = exports.race = Query('race', function (iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* race() {
    const promises = this.iterators.map(iter => runProcess(iter, handler || this.handler));
    const result = yield Promise.race(promises);
    promises.forEach(p => p.cancel());
    return result;
  };
});

const all = exports.all = Query('all', function (iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* all() {
    return yield Promise.all(this.iterators.map(iter => runProcess(iter, handler || this.handler)));
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
  if (hasIterator(iter2)) {
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
  iter = getIterator(iter);

  while (!(result = iter.next(input)).done) {
    input = yield f(result.value, index++);
  }

  return f(result.value, index++);
}

function* filter(f, iter) {
  let result,
      input,
      index = 0;
  iter = getIterator(iter);

  while (!(result = iter.next(input)).done) {
    if (f(result.value, index++)) input = yield result.value;
  }

  if (f(result.value, index++)) return result.value;
}
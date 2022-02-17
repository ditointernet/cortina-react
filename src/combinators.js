import { runProcess } from './process';
import Query from './Query';
import { getIterator, hasIterator } from './types';

export function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function pipe(...fns) {
  return function*(arg) {
    let ret = arg;
    for (let fn of fns) {
      ret = yield fn(ret);
    }
    return ret;
  };
}

export function* compose(...fns) {
  yield* pipe(fns.reverse());
}

export const race = Query('race', function(iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* race() {
    const promises = this.iterators.map(iter =>
      runProcess(iter, handler || this.handler)
    );
    const result = yield Promise.race(promises);
    promises.forEach(p => p.cancel());
    return result;
  };
});

export const all = Query('all', function(iterators = [], handler) {
  this.iterators = iterators;
  this.handler = null;

  return function* all() {
    return yield Promise.all(
      this.iterators.map(iter => runProcess(iter, handler || this.handler))
    );
  };
});

export function step(iterator, ...args) {
  const { value, done } = iterator.next(...args);
  return { value, iterator, done };
}

export function* after(iter, gen) {
  const res = yield* iter;
  const iter2 = gen(res);
  if (hasIterator(iter2)) {
    yield* iter2;
  } else {
    return iter2;
  }
}

export function loop(fn) {
  return arg => loopWhile(() => true, fn)(arg);
}

export function loopWhile(cond, fn) {
  return function* loopWhile(arg) {
    let ret = arg;
    do {
      ret = yield* fn(ret);
    } while (cond(ret));
    return ret;
  };
}

export function* map(f, iter) {
  let result,
    input,
    index = 0;
  iter = getIterator(iter);

  while (!(result = iter.next(input)).done) {
    input = yield f(result.value, index++);
  }

  return f(result.value, index++);
}

export function* filter(f, iter) {
  let result,
    input,
    index = 0;
  iter = getIterator(iter);

  while (!(result = iter.next(input)).done) {
    if (f(result.value, index++)) input = yield result.value;
  }

  if (f(result.value, index++)) return result.value;
}

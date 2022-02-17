/* istanbul ignore file */
export function isFunction(fn) {
  return fn && typeof fn === 'function';
}

export function isObject(obj) {
  return obj && typeof obj === 'object';
}

export function isPromise(p) {
  return p && isFunction(p.then);
}

export function isIterator(iter) {
  return iter && isFunction(iter.next);
}

export function hasIterator(gen) {
  return gen && isFunction(gen[Symbol.iterator]);
}

export function hasAsyncIterator(gen) {
  return gen && isFunction(gen[Symbol.asyncIterator]);
}

export function getIterator(gen, ...args) {
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

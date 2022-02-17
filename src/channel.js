import { runProcess } from './process';
import { getIterator, isFunction } from './types';

export const chan = () => new Channel();
export const take = ch => ch.take;
export const put = (ch, value) => ch.put(value);

//
export function spawn(iter, handler) {
  const channel = new Channel();
  runProcess(gen, value => {
    const transformedValue = isFunction(handler) ? handler(value) : value;
    channel.put(transformedValue);
    return transformedValue;
  });
  return channel;
}

export function go(gen, ...args) {
  return spawn(getIterator(gen, ...args));
}

export default class Channel {
  constructor() {
    this._listeners = [];
    this._closeResolve = null;
    this._closePromise = new Promise(resolve => (this._closeResolve = resolve));
  }

  clear() {
    this._listeners = [];
  }

  close() {
    this._closed = true;
    this._closeResolve();
  }

  put(value) {
    if (this._listeners.length > 0) {
      for (let resolve of this._listeners) {
        resolve(value);
      }
      this.clear();
    } else {
      this._value = value;
      this._hasValue = true;
    }
  }

  get take() {
    if (this._hasValue) {
      const value = this._value;
      this._value = undefined;
      this._hasValue = false;
      return Promise.resolve(value);
    } else {
      return new Promise(resolve => this._listeners.push(resolve));
    }
  }

  get whenClosed() {
    return this._closePromise;
  }

  get isClosed() {
    return this._closed;
  }

  async *[Symbol.asyncIterator]() {
    while (!this.isClosed) {
      yield await this.take;
    }
  }
}

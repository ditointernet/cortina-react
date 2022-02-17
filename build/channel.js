'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.put = exports.take = exports.chan = undefined;

var _asyncGenerator = function () { function AwaitValue(value) { this.value = value; } function AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; if (value instanceof AwaitValue) { Promise.resolve(value.value).then(function (arg) { resume("next", arg); }, function (arg) { resume("throw", arg); }); } else { settle(result.done ? "return" : "normal", result.value); } } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } } if (typeof Symbol === "function" && Symbol.asyncIterator) { AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; } AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); }; AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); }; AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); }; return { wrap: function (fn) { return function () { return new AsyncGenerator(fn.apply(this, arguments)); }; }, await: function (value) { return new AwaitValue(value); } }; }();

exports.spawn = spawn;
exports.go = go;

var _process = require('./process');

var _types = require('./types');

const chan = exports.chan = () => new Channel();
const take = exports.take = ch => ch.take;
const put = exports.put = (ch, value) => ch.put(value);

//
function spawn(iter, handler) {
  const channel = new Channel();
  (0, _process.runProcess)(gen, value => {
    const transformedValue = (0, _types.isFunction)(handler) ? handler(value) : value;
    channel.put(transformedValue);
    return transformedValue;
  });
  return channel;
}

function go(gen, ...args) {
  return spawn((0, _types.getIterator)(gen, ...args));
}

class Channel {
  constructor() {
    this._listeners = [];
    this._closeResolve = null;
    this._closePromise = new Promise(resolve => this._closeResolve = resolve);
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

  [Symbol.asyncIterator]() {
    var _this = this;

    return _asyncGenerator.wrap(function* () {
      while (!_this.isClosed) {
        yield yield _asyncGenerator.await(_this.take);
      }
    })();
  }
}
exports.default = Channel;
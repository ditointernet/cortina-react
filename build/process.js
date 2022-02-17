'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runProcess = undefined;

var _CancellationToken = require('./CancellationToken');

var _CancellationToken2 = _interopRequireDefault(_CancellationToken);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runProcess = exports.runProcess = (gen, handler, cancellationToken) => new Process(gen, handler, cancellationToken).run();

class Process {
  constructor(gen, handler = null, cancellationToken = new _CancellationToken2.default()) {
    this._onResolve = input => {
      if (this._cancellationToken.isCancelled) return;

      try {
        const step = this._iterator.next(input);
        if ((0, _types.isPromise)(step)) {
          step.then(this._onNext);
        } else {
          this._onNext(step);
        }
      } catch (err) {
        return this._reject(err);
      }
    };

    this._onReject = err => {
      try {
        if ((0, _types.isFunction)(this._iterator.throw)) {
          this._onNext(this._iterator.throw(err));
          this._cancellationToken.restore();
        } else {
          throw err;
        }
      } catch (err) {
        return this._reject(err);
      }
    };

    this._onNext = ({ value, done }) => {
      if (this._cancellationToken.isCancelled) return;

      value = (0, _types.isFunction)(this._handler) ? this._handler(value) : value;

      if (done) return this._resolve(value);

      if ((0, _types.isFunction)(value) && !(0, _types.hasIterator)(value) && !(0, _types.hasAsyncIterator)(value)) {
        value = value();
      }

      const promise = (0, _types.hasIterator)(value) || (0, _types.hasAsyncIterator)(value) ? new Process(value, this._handler, this._cancellationToken).run() : Promise.resolve(value);

      promise.then(this._onResolve, this._onReject);
    };

    this._iterator = (0, _types.getIterator)(gen);
    this._handler = handler;
    this._cancellationToken = cancellationToken;
    this._isRunning = false;

    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    if (!(0, _types.isIterator)(this._iterator)) {
      throw new TypeError(`Supplied coroutine program is neither a function nor a generator: ${gen}`);
    }
  }

  cancel() {
    this._cancellationToken.cancel();
  }

  *[Symbol.iterator]() {
    return yield* this._iterator;
  }

  get promise() {
    return this._promise;
  }

  run() {
    if (this._isRunning) {
      throw new Error('Process is already running');
    }

    this._isRunning = true;
    this._onResolve();
    return this._promise;
  }

}
exports.default = Process;
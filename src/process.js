import CancellationToken from './CancellationToken';
import {
  getIterator,
  hasAsyncIterator,
  hasIterator,
  isFunction,
  isIterator,
  isPromise,
} from './types';

export const runProcess = (gen, handler, cancellationToken) =>
  new Process(gen, handler, cancellationToken).run();

export default class Process {
  constructor(
    gen,
    handler = null,
    cancellationToken = new CancellationToken()
  ) {
    this._iterator = getIterator(gen);
    this._handler = handler;
    this._cancellationToken = cancellationToken;
    this._isRunning = false;

    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    if (!isIterator(this._iterator)) {
      throw new TypeError(
        `Supplied coroutine program is neither a function nor a generator: ${gen}`
      );
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

  _onResolve = input => {
    if (this._cancellationToken.isCancelled) return;

    try {
      const step = this._iterator.next(input);
      if (isPromise(step)) {
        step.then(this._onNext);
      } else {
        this._onNext(step);
      }
    } catch (err) {
      return this._reject(err);
    }
  };

  _onReject = err => {
    try {
      if (isFunction(this._iterator.throw)) {
        this._onNext(this._iterator.throw(err));
        this._cancellationToken.restore();
      } else {
        throw err;
      }
    } catch (err) {
      return this._reject(err);
    }
  };

  _onNext = ({ value, done }) => {
    if (this._cancellationToken.isCancelled) return;

    value = isFunction(this._handler) ? this._handler(value) : value;

    if (done) return this._resolve(value);

    if (isFunction(value) && !hasIterator(value) && !hasAsyncIterator(value)) {
      value = value();
    }

    const promise =
      hasIterator(value) || hasAsyncIterator(value)
        ? new Process(value, this._handler, this._cancellationToken).run()
        : Promise.resolve(value);

    promise.then(this._onResolve, this._onReject);
  };
}

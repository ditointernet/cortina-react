import { isFunction, isPromise } from './types';

export default class CancellationToken {
  constructor(cancelled) {
    this._cancelled = false;

    if (isFunction(cancelled)) {
      this._shouldCancel = cancelled;
    } else if (isPromise(cancelled)) {
      cancelled.then(() => this.cancel());
    } else {
      this._cancelled = cancelled || false;
    }

    this._cancelResolve = null;
    this._cancelPromise = new Promise(
      resolve => (this._cancelResolve = resolve)
    );
  }

  get isCancelled() {
    if (this._shouldCancel && this._shouldCancel()) {
      this.cancel();
    }
    return this._cancelled || false;
  }

  get whenCancelled() {
    return this.isCancelled ? Promise.resolve(true) : this._cancelPromise;
  }

  cancel() {
    this._shouldCancel = null;
    this._cancelled = true;
    this._cancelResolve(true);
  }

  restore() {
    this._cancelled = false;
  }
}

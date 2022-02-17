import React, { Component } from 'react';

import Process from './process';
import { all, race } from './combinators';
import { getIterator, isFunction } from './types';

import { emit } from './event';

//
export const co = coroutineElement;
export function coroutineElement(iterator, children) {
  return React.createElement(
    Coroutine,
    { __iterator: getIterator(iterator) },
    ...children
  );
}

//
export function coroutineComponent(generator) {
  return class extends Coroutine {
    static get displayName() {
      return generator.name || generator.displayName || 'Anonymous';
    }

    static get coroutine() {
      return generator;
    }

    get [Symbol.iterator]() {
      return generator(this.props);
    }
  };
}

class Coroutine extends Component {
  constructor(props) {
    super(props);
    this.state = { view: null };
    this.target = this.iterator = this.forceUpdate(props);
    this.promise = null;
    this.mounted = false;
  }

  componentDidMount() {
    if (this.mounted) this.forceUpdate(this.props);
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps) return;

    this.cancel();
    if (this.mounted) this.forceUpdate(this.props, prevProps);
  }

  componentWillUnmount() {
    this.cancel();
    this.mounted = false;
  }

  cancel() {
    this.promise && this.promise.cancel();
    this.iterator && isFunction(this.iterator.return) && this.iterator.return();
  }

  restart(props, prevProps) {
    this.iterator = getIterator(
      props.__iterator || this[Symbol.iterator],
      props,
      prevProps
    );
    this.target = this.iterator;
    return this.iterator;
  }

  update = view => {
    if (this.mounted && this.iterator === this.target) {
      this.setState({ view });
    }
  };

  forceUpdate(props, prevProps) {
    this.restart(props, prevProps);

    this.promise && this.promise.cancel();
    this.promise = new Process(this.iterator, this._handler).run();

    const { onReturn } = props;
    this.promise.then(r => (isFunction(onReturn) ? onReturn(r) : null));

    return this.iterator;
  }

  render() {
    return this.state.view || null;
  }

  _handler = query => {
    if (!query) return;

    const { onEmit, onYield } = this.props;

    if (isFunction(onYield)) {
      onYield(query.event);
    }

    if (React.isValidElement(query)) {
      this.update(query);
      return;
    } else if (query instanceof emit) {
      if (isFunction(onEmit)) onEmit(query.event);
      return query;
    } else if (query instanceof all || query instanceof race) {
      query.handler = this._handler;
      return query;
    } else {
      return query;
    }
  };
}

import { Component } from 'react;';
import { Process } from 'cora';
import { all, race } from 'cora/combinators';
import { getIterator, isFunction } from 'cora/types';

import { emit } from './event';
import { render } from './render';

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
      return generator;
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
    if (this.mounted) this.forceUpdate(this.props);
  }

  componentWillUnmount() {
    this.cancel();
    this.mounted = false;
  }

  cancel() {
    this.promise && this.promise.cancel();
    this.iterator && isFunction(this.iterator.return) && this.iterator.return();
  }

  restart(props) {
    this.iterator = getIterator(
      props.__iterator || this[Symbol.iterator],
      props
    );
    this.target = this.iterator;
    return this.iterator;
  }

  update = view => {
    if (this.mounted && this.iterator === this.target) {
      this.setState({ view });
    }
  };

  forceUpdate(props) {
    this.restart(props);

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
    const { onEmit, onYield } = this.props;

    if (!query) return;

    if (isFunction(onYield)) onYield(query.event);

    switch (query.constructor) {
      case render:
        return query[Symbol.iterator](this, this.update);

      case emit:
        if (isFunction(onEmit)) onEmit(query.event);
        return query;

      case race:
      case all:
        query.handler = this._handler;
        return query;

      default:
        return query;
    }
  };
}

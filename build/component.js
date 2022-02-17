'use strict';

exports.__esModule = true;
exports.co = undefined;
exports.coroutineElement = coroutineElement;
exports.coroutineComponent = coroutineComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

var _combinators = require('./combinators');

var _types = require('./types');

var _event = require('./event');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
const co = exports.co = coroutineElement;
function coroutineElement(iterator, children) {
  return _react2.default.createElement(Coroutine, { __iterator: (0, _types.getIterator)(iterator) }, ...children);
}

//
function coroutineComponent(generator) {
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

class Coroutine extends _react.Component {
  constructor(props) {
    super(props);

    this.update = view => {
      if (this.mounted && this.iterator === this.target) {
        this.setState({ view });
      }
    };

    this._handler = query => {
      if (!query) return;

      var _props = this.props;
      const onEmit = _props.onEmit,
            onYield = _props.onYield;


      if ((0, _types.isFunction)(onYield)) {
        onYield(query.event);
      }

      if (_react2.default.isValidElement(query)) {
        this.update(query);
        return;
      } else if (query instanceof _event.emit) {
        if ((0, _types.isFunction)(onEmit)) onEmit(query.event);
        return query;
      } else if (query instanceof _combinators.all || query instanceof _combinators.race) {
        query.handler = this._handler;
        return query;
      } else {
        return query;
      }
    };

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
    this.iterator && (0, _types.isFunction)(this.iterator.return) && this.iterator.return();
  }

  restart(props, prevProps) {
    this.iterator = (0, _types.getIterator)(props.__iterator || this[Symbol.iterator], props, prevProps);
    this.target = this.iterator;
    return this.iterator;
  }

  forceUpdate(props, prevProps) {
    this.restart(props, prevProps);

    this.promise && this.promise.cancel();
    this.promise = new _process2.default(this.iterator, this._handler).run();

    const onReturn = props.onReturn;

    this.promise.then(r => (0, _types.isFunction)(onReturn) ? onReturn(r) : null);

    return this.iterator;
  }

  render() {
    return this.state.view || null;
  }

}
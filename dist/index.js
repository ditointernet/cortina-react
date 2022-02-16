'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.co = undefined;
exports.coroutineElement = coroutineElement;
exports.coroutineComponent = coroutineComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cortina = require('cortina');

var _combinators = require('cortina/src/combinators');

var _types = require('cortina/src/types');

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
    this.promise = new _cortina.Process(this.iterator, this._handler).run();

    const onReturn = props.onReturn;

    this.promise.then(r => (0, _types.isFunction)(onReturn) ? onReturn(r) : null);

    return this.iterator;
  }

  render() {
    return this.state.view || null;
  }

}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = exports.emit = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mapDispatch = mapDispatch;

var _cortina = require('cortina');

var _types = require('cortina/src/types');

const emit = exports.emit = (0, _cortina.Query)('emit', function (event) {
  this.event = event;
  return function* () {
    yield;
    return event;
  };
});

const wait = exports.wait = (0, _cortina.Query)('wait', function (view) {
  if (!(0, _types.isFunction)(view)) throw new Error(`"wait" must receive as argument a function that returns a ReactElement.`);

  this.view = this.element = view;

  this.channel = new _cortina.Channel();
  this.dispatch = value => this.channel.put(value);
  this.take = this.channel.take;

  return function* () {
    yield this.view(this.dispatch);
    return this.take;
  };
});

function mapDispatch(actions, dispatch) {
  return Object.keys(actions).reduce((obj, key) => _extends({}, obj, {
    [key]: (...args) => dispatch(actions[key](...args))
  }), {});
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _component = require('./component');

Object.defineProperty(exports, 'co', {
  enumerable: true,
  get: function () {
    return _component.co;
  }
});
Object.defineProperty(exports, 'coroutineElement', {
  enumerable: true,
  get: function () {
    return _component.coroutineElement;
  }
});
Object.defineProperty(exports, 'coroutineComponent', {
  enumerable: true,
  get: function () {
    return _component.coroutineComponent;
  }
});

var _event = require('./event');

Object.keys(_event).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _event[key];
    }
  });
});

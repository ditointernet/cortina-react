'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = exports.emit = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mapDispatch = mapDispatch;

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emit = exports.emit = (0, _Query2.default)('emit', function (event) {
  this.event = event;
  return function* () {
    yield;
    return event;
  };
});

const wait = exports.wait = (0, _Query2.default)('wait', function (view) {
  if (!(0, _types.isFunction)(view)) throw new Error(`"wait" must receive as argument a function that returns a ReactElement.`);

  this.view = this.element = view;

  this.channel = new _channel2.default();
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
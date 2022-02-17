'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = exports.emit = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mapDispatch = mapDispatch;

var _cortina = require('cortina');

var Cortina = _interopRequireWildcard(_cortina);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _Cortina$default = Cortina.default;
const Channel = _Cortina$default.Channel,
      Query = _Cortina$default.Query;


function isFunction(fn) {
  return fn && typeof fn === 'function';
}

const emit = exports.emit = Query('emit', function (event) {
  this.event = event;
  return function* () {
    yield;
    return event;
  };
});

const wait = exports.wait = Query('wait', function (view) {
  if (!isFunction(view)) throw new Error(`"wait" must receive as argument a function that returns a ReactElement.`);

  this.view = this.element = view;

  this.channel = new Channel();
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
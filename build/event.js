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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapDispatch = exports.emit = exports.wait = exports.coroutineComponent = exports.coroutineElement = exports.co = undefined;

var _component = require('./component');

var _event = require('./event');

exports.co = _component.co;
exports.coroutineElement = _component.coroutineElement;
exports.coroutineComponent = _component.coroutineComponent;
exports.wait = _event.wait;
exports.emit = _event.emit;
exports.mapDispatch = _event.mapDispatch;
exports.default = _component.coroutineComponent;
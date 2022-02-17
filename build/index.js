'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.go = exports.spawn = exports.runProcess = exports.CancellationToken = exports.Query = exports.getIterator = exports.isPromise = exports.isObject = exports.isIterator = exports.isFunction = exports.filter = exports.map = exports.loopWhile = exports.loop = exports.after = exports.step = exports.all = exports.race = exports.compose = exports.pipe = exports.delay = exports.mapDispatch = exports.emit = exports.wait = exports.coroutineComponent = exports.coroutineElement = exports.co = undefined;

var _combinators = require('./combinators');

Object.defineProperty(exports, 'delay', {
  enumerable: true,
  get: function () {
    return _combinators.delay;
  }
});
Object.defineProperty(exports, 'pipe', {
  enumerable: true,
  get: function () {
    return _combinators.pipe;
  }
});
Object.defineProperty(exports, 'compose', {
  enumerable: true,
  get: function () {
    return _combinators.compose;
  }
});
Object.defineProperty(exports, 'race', {
  enumerable: true,
  get: function () {
    return _combinators.race;
  }
});
Object.defineProperty(exports, 'all', {
  enumerable: true,
  get: function () {
    return _combinators.all;
  }
});
Object.defineProperty(exports, 'step', {
  enumerable: true,
  get: function () {
    return _combinators.step;
  }
});
Object.defineProperty(exports, 'after', {
  enumerable: true,
  get: function () {
    return _combinators.after;
  }
});
Object.defineProperty(exports, 'loop', {
  enumerable: true,
  get: function () {
    return _combinators.loop;
  }
});
Object.defineProperty(exports, 'loopWhile', {
  enumerable: true,
  get: function () {
    return _combinators.loopWhile;
  }
});
Object.defineProperty(exports, 'map', {
  enumerable: true,
  get: function () {
    return _combinators.map;
  }
});
Object.defineProperty(exports, 'filter', {
  enumerable: true,
  get: function () {
    return _combinators.filter;
  }
});

var _types = require('./types');

Object.defineProperty(exports, 'isFunction', {
  enumerable: true,
  get: function () {
    return _types.isFunction;
  }
});
Object.defineProperty(exports, 'isIterator', {
  enumerable: true,
  get: function () {
    return _types.isIterator;
  }
});
Object.defineProperty(exports, 'isObject', {
  enumerable: true,
  get: function () {
    return _types.isObject;
  }
});
Object.defineProperty(exports, 'isPromise', {
  enumerable: true,
  get: function () {
    return _types.isPromise;
  }
});
Object.defineProperty(exports, 'getIterator', {
  enumerable: true,
  get: function () {
    return _types.getIterator;
  }
});

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

var _CancellationToken = require('./CancellationToken');

var _CancellationToken2 = _interopRequireDefault(_CancellationToken);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _component = require('./component');

var _event = require('./event');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.co = _component.co;
exports.coroutineElement = _component.coroutineElement;
exports.coroutineComponent = _component.coroutineComponent;
exports.wait = _event.wait;
exports.emit = _event.emit;
exports.mapDispatch = _event.mapDispatch;
exports.Query = _Query2.default;
exports.CancellationToken = _CancellationToken2.default;
exports.runProcess = _process.runProcess;
exports.spawn = _channel.spawn;
exports.go = _channel.go;
exports.default = {
  coroutineComponent: _component.coroutineComponent,
  Process: _process2.default,
  Channel: _channel2.default,
  Query: _Query2.default,
  CancellationToken: _CancellationToken2.default
};
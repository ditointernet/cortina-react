import { Query } from 'cora';
import { isFunction } from 'cora/src/types';
import { render } from './render';

export const emit = Query('emit', function(event) {
  this.event = event;
  return function*() {
    yield;
    return event;
  };
});

export const wait = Query('wait', function(query) {
  if (!(query instanceof render) && !isFunction(query))
    throw new Error(
      `"${name}" must receive a "render" query or a function as argument.`
    );

  this.render = query instanceof render ? query : render(query);

  return function*() {
    yield this.render;
    return this.render.take;
  };
});

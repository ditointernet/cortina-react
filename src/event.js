import { Channel, Query } from 'cora';
import { isFunction } from 'cora/src/types';

export const emit = Query('emit', function(event) {
  this.event = event;
  return function*() {
    yield;
    return event;
  };
});

export const wait = Query('wait', function(view) {
  if (!isFunction(view))
    throw new Error(
      `"wait" must receive as argument a function that returns a ReactElement.`
    );

  this.view = this.element = view;

  this.channel = new Channel();
  this.send = value => this.channel.put(value);
  this.take = this.channel.take;

  return function*() {
    yield this.view(this.send);
    return this.take;
  };
});

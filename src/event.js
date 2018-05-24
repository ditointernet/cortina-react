import { Channel, Query } from 'cortina';
import { isFunction } from 'cortina/src/types';

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
  this.dispatch = value => this.channel.put(value);
  this.take = this.channel.take;

  return function*() {
    yield this.view(this.dispatch);
    return this.take;
  };
});

export function mapDispatch(actions, dispatch) {
  return Object.keys(actions).reduce(
    (obj, key) => ({
      ...obj,
      [key]: (...args) => dispatch(actions[key](...args)),
    }),
    {}
  );
}

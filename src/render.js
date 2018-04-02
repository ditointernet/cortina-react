import { Channel, Query } from 'cora';

export const render = Query('render', function(view) {
  this.view = this.element = view;

  this.channel = new Channel();
  this.send = value => this.channel.put(value);
  this.take = this.channel.take;

  return function* render(component, update) {
    yield;
    update(typeof this.view === 'function' ? this.view(this.send) : this.view);
  };
});

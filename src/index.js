import Channel, { spawn, go } from './channel';
import Process, { runProcess } from './process';
import CancellationToken from './CancellationToken';
import Query from './Query';

import { co, coroutineElement, coroutineComponent } from './component';
import { wait, emit, mapDispatch } from './event';

export { co, coroutineElement, coroutineComponent, wait, emit, mapDispatch };

export {
  delay,
  pipe,
  compose,
  race,
  all,
  step,
  after,
  loop,
  loopWhile,
  map,
  filter,
} from './combinators';

export {
  isFunction,
  isIterator,
  isObject,
  isPromise,
  getIterator,
} from './types';

export { Query, CancellationToken, runProcess, spawn, go };

export default {
  coroutineComponent,
  Process,
  Channel,
  Query,
  CancellationToken,
};

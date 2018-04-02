import { emit, wait } from '../src/event';

test('emit should be a valid query', () => {
  const q = emit('test');
  expect(q).toBeInstanceOf(emit);
});

test('wait should be a valid query', () => {
  const q = wait('test');
  expect(q).toBeInstanceOf(wait);
});

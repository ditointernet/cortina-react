import { coroutineComponent } from '../src/component';

test('Should create component from an empty coroutine', () => {
  const component = coroutineComponent(function*() {});
  expect(component.prototype.isReactComponent).toBeTruthy();
});

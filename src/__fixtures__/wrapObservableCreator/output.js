const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
__rxjsDebugRuntime
  .wrapObservableCreator(combineLatest, {
    name: 'combineLatest',
  })([observable])
  .subscribe(() => {});
function foo() {
  __rxjsDebugRuntime
    .wrapObservableCreator(combineLatest, {
      name: 'foo.combineLatest',
    })([observable])
    .subscribe(() => {});
}
class Foo {
  bar() {
    __rxjsDebugRuntime
      .wrapObservableCreator(combineLatest, {
        name: 'Foo.bar.combineLatest',
      })([observable])
      .subscribe(() => {});
  }
}

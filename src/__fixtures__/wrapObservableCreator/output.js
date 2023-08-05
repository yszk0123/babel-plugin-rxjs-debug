const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
__rxjsDebugRuntime
  .wrapObservableCreator(combineLatest, {
    label: 'combineLatest',
  })([observable])
  .subscribe(() => {});
function foo() {
  __rxjsDebugRuntime
    .wrapObservableCreator(combineLatest, {
      label: 'foo.combineLatest',
    })([observable])
    .subscribe(() => {});
}
class Foo {
  bar() {
    __rxjsDebugRuntime
      .wrapObservableCreator(combineLatest, {
        label: 'Foo.bar.combineLatest',
      })([observable])
      .subscribe(() => {});
  }
}

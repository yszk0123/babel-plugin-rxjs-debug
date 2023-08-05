const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
const __rxjsDebugOperators = require('rxjs/operators');
__rxjsDebugRuntime
  .wrapObservableCreator(combineLatest, {
    label: 'combineLatest',
  })([observable])
  .pipe(
    __rxjsDebugOperators.tap(
      __rxjsDebugRuntime.wrapObservableCreatorPipe({
        label: 'combineLatest',
      }),
    ),
  )
  .subscribe(() => {});
function foo() {
  __rxjsDebugRuntime
    .wrapObservableCreator(combineLatest, {
      label: 'foo.combineLatest',
    })([observable])
    .pipe(
      __rxjsDebugOperators.tap(
        __rxjsDebugRuntime.wrapObservableCreatorPipe({
          label: 'foo.combineLatest',
        }),
      ),
    )
    .subscribe(() => {});
}
class Foo {
  bar() {
    __rxjsDebugRuntime
      .wrapObservableCreator(combineLatest, {
        label: 'Foo.bar.combineLatest',
      })([observable])
      .pipe(
        __rxjsDebugOperators.tap(
          __rxjsDebugRuntime.wrapObservableCreatorPipe({
            label: 'Foo.bar.combineLatest',
          }),
        ),
      )
      .subscribe(() => {});
  }
}

const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
  label: 'subject',
});
const behaviorSubject = __rxjsDebugRuntime.wrapSubject(new BehaviorSubject(), {
  label: 'behaviorSubject',
});
const nonSubject = new NonSubject();
function foo() {
  const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
    label: 'foo.subject',
  });
}
class Foo {
  constructor() {
    this.subject$ = __rxjsDebugRuntime.wrapSubject(new Subject(), {
      label: 'Foo.constructor.subject$',
    });
  }
  bar() {
    const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
      label: 'Foo.bar.subject',
    });
  }
}

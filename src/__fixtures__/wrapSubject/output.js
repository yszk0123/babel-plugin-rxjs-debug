const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
  name: 'subject',
});
const behaviorSubject = __rxjsDebugRuntime.wrapSubject(new BehaviorSubject(), {
  name: 'behaviorSubject',
});
const nonSubject = new NonSubject();
function foo() {
  const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
    name: 'foo.subject',
  });
}
class Foo {
  bar() {
    const subject = __rxjsDebugRuntime.wrapSubject(new Subject(), {
      name: 'Foo.bar.subject',
    });
  }
}

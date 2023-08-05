const subject = new Subject();
const behaviorSubject = new BehaviorSubject();
const nonSubject = new NonSubject();

function foo() {
  const subject = new Subject();
}

class Foo {
  constructor() {
    this.subject$ = new Subject();
  }

  bar() {
    const subject = new Subject();
  }
}

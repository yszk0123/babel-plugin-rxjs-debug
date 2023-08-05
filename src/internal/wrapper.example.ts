import './register';
import { Subject, combineLatest } from 'rxjs';
import { wrapObservableCreator, wrapSubject } from './wrapper';

const subject = wrapSubject(new Subject<number>(), { label: 'test' });

wrapObservableCreator(combineLatest, { label: 'combine' })([
  subject.asObservable(),
]).subscribe({
  next(v) {
    console.log('v', v);
  },
});

subject.next(100);
subject.next(200);

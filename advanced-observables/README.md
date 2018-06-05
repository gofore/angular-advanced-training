# Advanced Observables
- Building an observable yourself
- Pipeable operators
- Creating a custom operator
- Subjects
- Hot vs. cold observables
- Testing observables

---
# Producer
- Every observable has some data source. In web these include:
    - DOM events (clicks, key presses, etc.): 0-N values
    - WebSockets: 0-N values
    - Intervals: 0-N values
    - AJAX: 1 value
    - Timeouts: 1 value
- This data source is called the producer as it produces the data. Data might be:
    - Coordinates of a click on screen
    - Pressed key
    - Number of times interval has triggered so far
    - HTTP response

---
# RxJS Observable Creators
RxJS provides observable creators for most of the producers:
- `fromEvent` for DOM events
- `webSocket` for Web Sockets
- `of` and `from` for static values
- `range` for ranges
- `fromPromise` for current promise

---
# Observable Autopsy
Observables are just functions binding the observer to the producer's events and provide the destructuring logic with uniform API:
```typescript
function myObservable(observer) {
    const datasource = new DataSource();
    datasource.ondata = (e) => observer.next(e);
    datasource.onerror = (err) => observer.error(err);
    datasource.oncomplete = () => observer.complete();
    return () => {
        datasource.destroy();
    };
}
```

```typescript
myObservable({
    next: console.log,
    error: console.error,
    complete: () => console.log('Completed'),
})
```

---
# Exercise
1. Implement a function `intervalObservable` which creates an observable that when subscribed emits next value (0, 1, 2 and so on) every N (argument) milliseconds. You can skip error or complete events. The following should work:
```typescript
const subscription = intervalObservable(500).subscribe({ next: console.log });
setTimeout(subscription, 3000);
// Should log 0, 1, 2, 3, 4, 5
```
2. Make your observable more RxJS-ish by altering it to accept the `next` as first argument and returning an object with `unsubscribe` method:
```typescript
const subscription = intervalObservable(500).subscribe(console.log);
setTimeout(subscription.unsubscribe, 3000);
// Should log 0, 1, 2, 3, 4, 5
```
3. Add second parameter for `intervalObservable` called `duration` which is used to determine when the observable should complete and then add second parameter for the complete function to be provided so that this works:
```typescript
intervalObservable(500, 3000).subscribe(console.log, () => console.log('Completed!'));
// Should log 0, 1, 2, 3, 4, 5, Completed!
```

---
# RxJS Building Blocks
- Observables
- Operators
- Subscriptions/subscribers
- Subjects
- Schedulers

---
# Pipeable Operators
- [New way](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md) to apply operators released in RxJS 5.5
```typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
Observable.of(1, 2, 3).map(x => x * 2).subscribe(console.log);
```
becomes
```typescript
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
of(1, 2, 3).pipe(map(x => x * 2)).subscribe(console.log);
```
- No more `Observable.prototype` patching
- 4 operators renamed:
    - `do` -> `tap`
    - `catch` -> `catchError`
    - `switch` -> `switchAll`
    - `finally` -> `finalize`
- Called also "lettable operators"

---
# Pipeable Operators
- Pros: 
    - Tree-shaking possible
    - Static analysis possible
    - Functional composition -> custom operators easier to implement
- Works best with TS >2.4
- Import from `rxjs/operators/<operator name>` instead of `rxjs/operators` to minimize bundles

---
# Exercise
Convert the following to lettable operators syntax

```typescript
Observable.of(1, 2, 3).map(x => x * 2).subscribe(console.log);
Observable.fromEvent(document, 'click')
    .filter(event => event.clientX < 100)
    .bufferTime(1000)
    .subscribe(console.log);
```

---
# Custom Operators
With RxJS 5.5. lettable operators as simple as implementing function that returns a function with signature:

```typescript
(source: Observable<T>): Observable<R>
```

```typescript
export const toPower =
  (n: number) =>
    (source: Observable<number>): Observable<number> =>
      source.pipe(map((x: number) => Math.pow(x, n)));
```

which could then be composed like

```typescript
import { range } from 'rxjs/observable/range';
import { toPower } from './to-power.operator';

range(0, 10).pipe(toPower(3)).subscribe(console.log)
```

---
# Exercise
Implement custom operator called `flatten` that operates on an array of arrays (like `[[1, 2, 3], [4, 5, 6]]`) and flattens them to single-dimension array ([1, 2, 3, 4, 5, 6])

Your operator should log `[1, 2, 3, 4, 5, 6]` when used like this:
```typescript
import { of } from 'rxjs/observable/of';
of([[1, 2, 3], [4, 5, 6]]).pipe(flatten()).subscribe(console.log)
```

Tip: Your operator function accepts no parameters at all

Bonus: Make types sound so that the array that is returned has to contain items of same type than the original (generic typing)  

---
# Hot vs. Cold Observables
[Ben Lesh](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339) (RxJS 5 author): 
- "An observable is "cold" if its underlying producer is created and activated during subscription."
- "An observable is "hot" if its underlying producer is either created or activated outside of subscription."
- "Warm": Subscriptions shared but producer is only initiated once there is a single subscription

In practice:
- RxJS Observables are cold
- Promises are always hot

---
# Cold Observables

```typescript
const observable = this.httpClient.get('example.com/foo.json'); // 1
observable.subscribe(console.log); // 2
```

On line 1 the producer (HTTP request) isn't created/activated yet
On line 2 the subscription causes producer to be activated

```typescript
observable.filter(x => x % 2 === 0)
  .subscribe(x => console.log('even', x));
observable.filter(x => x % 2 === 1)
  .subscribe(x => console.log('odd', x));
```

---
# Subject
Subject is a combination of observable and observer
- Has the `Observable`'s methods like `subscribe` and `pipe`
- Has the `next` method to publish new values

```typescript
const subject = new Subject<number>();
subject.subscribe(console.log);
subject.next(100); // 100 is logged to console
```

Subscription is shared under the hood -> can have multiple subscribers (unlike observable):
```typescript
const subject = new Subject();
const obs = interval(1000);
obs.subscribe(subject);
subject.subscribe(console.log);
setTimeout(() => {
  subject.subscribe(console.log);
}, 5000);
```
Prints 0, 1, 2, 3, 4, 4, 5, 5, 6, 6

---
# Making Observables Hot

```typescript
function makeHot(cold) {
  const subject = new Subject();
  cold.subscribe(subject);
  return new Observable((observer) => subject.subscribe(observer));
}
```

```typescript
const httpRequest = this.httpClient.get('example.com/foo.json');
const hotObservable = makeHot(httpRequest); // Request is sent
hotObservable.subscribe(console.log); // Logs the response once available
hotObservable.subscribe(console.log); // Second subscribe does not generate second call
```

---
# Preloading Data

```typescript
@Injectable()
export class PreloadedNewsService {
    url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    request: Observable<any>;
    
    constructor(private httpClient: HttpClient) {
        this.request = makeHot(this.httpClient.get(this.url));
    }
    
    getNews() {
        return this.request;
    }
}
```

```typescript
this.preloadedNewsService.getNews().subscribe();
```

---
# `.publish()`
- Returns a `ConnectableObservable` that shares the subscription to the original observable but only subscribes once `.connect()` is called

```typescript
const obs = this.httpClient.get(this.url).publish(); // Returns ConnectableObservable
obs.subscribe(console.log);
obs.subscribe(console.log);
obs.connect(); 
```
- Calling `.connect()` multiple times subscribes to the source multiple times
- Subscriptions are made for the original observable, so they won't work:

```typescript
const obs = this.httpClient.get(this.url).publish(); // Returns ConnectableObservable
obs.subscribe(console.log); // This is logged normally
setTimeout(() => {
  obs.connect();
  obs.subscribe(console.log); // Does nothing as the original observable (HTTP request) has completed already
}, 5000);
obs.connect();
```

---
# `.share()` 
- Returns a new observable that always shares a single subscription to the original observable
- Same as `.publish().refCount()`
- `.refCount` is only available on `ConnectableObservable`. It returns a new observable that connects and stays connected to the source as long as there is at least one subscription to itself
```typescript
const obs = httpClient.get(this.url).share();
obs.subscribe(console.log);
obs.subscribe(console.log); // Only one request made since HTTP call takes long enough
```
- Assuming the HTTP response is retrieved in 10 seconds, the following will be make the request twice
```typescript
const obs = httpClient.get(this.url).share();
obs.subscribe(console.log);
setTimeout(() => obs.subscribe(console.log), 10000);
```

---
# Too Hot Observable
The following won't log anything assuming HTTP response arrives in 5 seconds
```typescript
const obs = this.httpClient.get(this.url).publish(); // Returns ConnectableObservable
obs.connect();
setTimeout(() => {
  obs.subscribe(console.log);
}, 5000);
```
Subject does not store values

---
# Subject Variations
- `BehaviorSubject`: Gives the last (or initial) value instantly when subscribing
```typescript
const subject = new BehaviorSubject<number>(10);
subject.subscribe(value => console.log('A: ' + value));
subject.next(20);
subject.subscribe(value => console.log('B: ' + value));
// A: 10
// A: 20
// B: 20
```
- `ReplaySubject`: Like `BehaviorSubject` but no initial value and can record multiple previous values 
- `AsyncSubject`: Gives the last value emitted for subscribers but only when it completes:
```typescript
const subject = new AsyncSubject<number>();
subject.subscribe(value => console.log('A: ' + value));
subject.next(10);
subject.subscribe(value => console.log('B: ' + value));
subject.next(20);
subject.complete();
// A: 20
// B: 20
```

---
# Exercise
Implement function `instantCache` that starts the interval instantly when created (is hot) and provides the same value for each subscriber

```typescript
const observable = instantCache(interval(1000).pipe(take(4)));
setTimeout(() => observable.subscribe(console.log), 5000);
// Should print "3" in 5 seconds
```

Tip: take completes after emitting 4 values
Tip: there are many subjects capable for this

---
# Testing Observables 
- Subscribe manually and then check that the values are correct
- Mocking problematic if no dependency injection is used (thank god Angular)
- Example:

```typescript
it('should make a call to Hacker News', () => {
    observable.take(1).subscribe(result => {
      expect(result).toEqual([1, 2, 3]);
    });
});
```

---
# Angular 4's `async as` Syntax
Angular 4 introduced two updates to templates

```angular2html
<div *ngIf="userList | async as users; else loading">
  <div *ngFor="let user of users; count as count; index as i">
    User {{i}} of {{count}}
  </div>
</div>
<ng-template #loading>Loading...</ng-template>
```

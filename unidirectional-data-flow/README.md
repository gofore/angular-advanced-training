# State Management & Unidirectional Data Flow
- What is state and its management?
- Service-based state management and its problems
- Unidirectional data flow
- Redux
- @ngrx for Angular state management

---
# What Is State?
- Collection of application's data
- Snapshot of everything stored within the app at any given time

---
# Different Kinds of State
- Client vs server state (current form filled by user vs. database-backed)
- UI vs application state (is button enabled vs. list of clients)
- Temporary vs permanent state (is collapsible section open or not vs. what is in database)

---
# Where Is State Stored?
- Database in server
- Database in client
- Functionality-scoped service (`CustomersService`)
- Functionality's component (`CustomerListComponent`)
- In URL (`my-app.com/customers/10`)

---
# State Synchronizing
- State is rarely in single location only
- Often state is moved from one place to another = state synchronization
- E.g.:
    - From server to client
    - From Angular service to component and vice versa
    - Via URL parameters to new service

---
# State Management
- Managing all of the mentioned gets cumbersome in large applications
- Purpose of state management provide consistent methodology for managing state that is:
    - Testable
    - Debuggable
    - Easy to reason about
    - Manageable
    - Scalable
    - Visualizable

---
# Using Services
- Service by backend resource (`CustomerService`, `ReportService`)
- Service has method for loading, saving, updating etc. some resource

```typescript
@Injectable()
export class HackerNewsService {

  constructor(private httpClient: HttpClient) {
  }

  findAll() {
    return this.httpClient.get('https://hacker-news.firebaseio.com/v0/topstories.json');
  }

  create(data: any) {
    // Simulate creating a new news
    const id = Math.floor(Math.random() * 100000);
    return Observable.of(id).pipe(delay(1000));
  }
}
```

---
# Problem with Services
- Reinventing the wheel every time with custom logic for asynchronous
- Unnecessary API calls easily done
- State management & synchronization split over all of the services

---
# Unidirectional Data Flow
Basic concepts:
- There is only a single application-wide state called *store*
- *Store* (and thus state) can only be changed by *a reducer*
- *Reducer* is triggered by *an action* 
- *Action* is a pair of name and payload such as `('ADD', 10)` triggered by UI

![Unidirectional Data Flow](unidirectional-data-flow/flow.png "Unidirectional Data Flow")

Source: [Stack Overflow](https://stackoverflow.com/q/45416237/1744702)

---
# Example (Empty) Store
- Store is usually a object:

```typescript
const store = {
    users: [],
    reports: [],
    currentUser: {}
};
```

- Though it can as well be anything like `number`:

```typescript
const store = 0;
```

---
# Actions
Composes of
- _Type_ 
    - Action's name as string
    - Should be unique within the app
    - Often consists of target reducer with the modification like `'[Counter] Add'`
- _Payload_
    - Any kind of data that is passed along for reducers
    - For example the increment size or newly created object

---
# Reducers
- Pure & synchronous function:
    - Result (output) depends only on arguments (inputs) passed
    - Inputs aren't modified
    - Does not cause side effects such as HTTP calls (revisited later)
    - Returns instantly instead of waiting for something (HTTP request, timeout) to be done 
- Simplest possible reducer returns the very same state:

```typescript
function reducer(currentState, action) {
    return currentState;
}
```

- The result of reducer will always be the new state of application
- Type of an action might look like:

```typescript
interface Action {
    name: string;
    payload: any;
}
``` 

---
# More advanced reducer
Assuming the application's state is number, reducer could look like:

```typescript
function reducer(currentState: number, action: Action) {
    switch(action.name) {
        case '[Counter] Add': {
            return currentState + action.payload;
        }
        case '[Counter] Decrease': {
            return currentState - action.payload;
        }
        default: {
            return currentState;
        }
    }
}
```

So the reducer would work like

```typescript
const initialState = 100;
const newState = reducer(initialState, { name: '[Counter] Add', payload: 10}); // newState is 110
```

---
# Redux
- Library implementing unidirectional data flow kind of state management
- By Facebook
- Based on the Flux
- De facto state management library when for React
- Three principles:
    - Single source of truth (store)
    - State is read-only (actions)
    - Changes are made with pure functions (reducers)

---
# Redux - Demo

---
# Immutability in JS
- In JavaScript nothing is actually immutable
- `const` is only constant reference to object:

```typescript
const obj = { foo: 'bar' };
obj.foo = 'asd'; // OK
obj = {}; // TypeError: Assignment to constant variable.
```

- Libraries available such as Immutable.js (by Facebook)
- Favor spreads that produce new object:
 
```typescript
const state = [1, 2, 3];
const payload = 4;
const newState = [...state, payload];
```

---
# Side Effects
- Everything has been synchronous so far - what about asynchronous actions? 
- Wikipedia: "a function is said to have a side effect if it modifies some state outside its scope"
- Problem: Programs behavior may be affected by order of evaluation 
- Numerous solutions in Redux world, e.g. [redux-thunk](https://github.com/gaearon/redux-thunk), [redux-saga](https://github.com/redux-saga/redux-saga) and [redux-observable](https://github.com/redux-observable/redux-observable) 

---
# @ngrx
- Reactive Extensions for Angular (RxJS = Reactive Extensions for JS)
- Full state management solution for Angular applications
- Basically Redux + RxJS 
- Set of npm modules:
    - @ngrx/store - Redux clone
    - @ngrx/effects - redux-observable like side effect management
    - @ngrx/router-store - Connects Angular router to store
    - @ngrx/devtools - Tooling for debugging store
    - @ngrx/entity - Entity State adapter for managing record collections
    - @ngrx/schematics - Angular CLI schematics to enable generators for @ngrx
- Angular's current router is based on @ngrx router
- Victor Savkin and Rob Wormald are part of the authors

---
# @ngrx/store
- Redux clone
- Observables (RxJS) used for store accessing
- Connected with Angular's dependency injection

---
# @ngrx/store - Setup
```bash
npm install @ngrx/store
```

```typescript
import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter';

export interface AppState {
    counter: number;
}

@NgModule({
  imports: [
    BrowserModule,
    `StoreModule.forRoot({ counter: counterReducer })`
  ]
})
export class AppModule {}
```

---
# @ngrx/store - Reducer

```typescript
// counter.ts
import { Action } from '@ngrx/store';

export const INCREMENT = '[Counter] Increment';
export const DECREMENT = '[Counter] Decrement';
export const RESET = '[Counter] Reset';

export function counterReducer(state: number = 0, action: Action) {
	switch (action.type) {
		case INCREMENT:
			return state + 1;

		case DECREMENT:
			return state - 1;

		case RESET:
			return 0;

		default:
			return state;
	}
}
```

---
# @ngrx/store - Accessing State

```typescript
export class MyAppComponent {
	counter: Observable<number>;

	constructor(private store: Store<AppState>) {
		this.counter = store.select('counter');
	}
}
```

```angular2html
<div>Current Count: {{ counter | async }}</div>
```

---
# @ngrx/store - Dispatching Actions

```typescript
export class MyAppComponent {
	constructor(private store: Store<AppState>) {
	}

	increment(){
		this.store.dispatch({ type: INCREMENT });
	}

	decrement(){
		this.store.dispatch({ type: DECREMENT });
	}

	reset(){
		this.store.dispatch({ type: RESET });
	}
}
```

---
# Typed Actions
Typed actions make it easy to wrap the action type and payload for dispatching

```typescript
export enum NewsActionTypes {
  IncrementCounterAction = '[Counter] Increment',
  ResetCounterAction = '[Counter] Reset'
}

export class IncrementAction implements Action {
  readonly type = NewsActionTypes.IncrementCounterAction;

  constructor(public value: number) {
  }
}

export class ResetAction implements Action {
  readonly type = NewsActionTypes.ResetCounterAction;
}


export type CounterAction = IncrementAction | ResetAction;
```

---
# Typed Action Reducer

```typescript
import { CounterAction, INCREMENT } from '../actions/counter.actions';

export function counterReducer(state = 10, action: CounterAction) {
  switch (action.type) {
    case INCREMENT:
      return state + action.value;

    default:
      return state;
  }
}
```

---
# Typed Action Dispatching

```typescript
this.store.dispatch(new IncrementAction(10));
this.store.dispatch(new ResetAction());
```

---
# Exercise
Let's get started. 
1. Run
```bash
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
npm install @ngrx/schematics --save-dev
ng config cli.defaultCollection @ngrx/schematics
ng generate store State --root --module app
ng generate effect App --root --module app
```

---
# Exercise
Let's create a feature called `news`.
1. Run
```bash
ng generate interface news
ng generate feature news --module app
ng generate component news
```
2. In `news.reducer.ts`, set up the state to contain
```typescript
news: News[]
```
and initial data to contain 
```typescript
news: [{ title: 'Taxation is getting even higher' }, { title: 'Weather is cold, again' }]
```
4. In `news.interface.ts` add
```typescript
title: string
```

---
# Selectors
- Selectors allow picking parts of the state
- Two types:
 - Feature selector: Select a feature from whole store
 - State selector: Withing one feature select the right part of the state

---
# Feature Selectores
- Choose the right feature from the overall state of the application
- Necessary because of lazy loading possibility of features
 
```typescript
export const getNewsFeature = createFeatureSelector<State>('news');
```

---
# State Selectors
- Choose the right part of the state based on the feature selector: 

```typescript
export const getNewsFeature = createFeatureSelector<State>('news');
export const getNewsSelector = createSelector(
  getNewsFeature,
  state => state.news
);
```

- Can also map data to certain format to provide more intelligent selectors:

```typescript
export const getNewsFeature = createFeatureSelector<State>('news');
export const getTopNewsSelector = createSelector(
  getNewsFeature,
  state => state.news.slice(0,5)
);
```

---
# Using Selectors
To access the state with selectors:

```typescript
import { Component, OnInit } from '@angular/core';
import { State } from '../reducers';
import { Store } from '@ngrx/store';
import { getNewsSelector } from '../news.reducer';
import { Observable } from 'rxjs/Observable';
import { News } from '../news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: Observable<News[]>;

  constructor(private store: Store<State>) {
    `this.news = this.store.select(getNewsSelector);`
  }
}
```

---
# Exercise
Create:
- A feature selector
- A state selector that uses the feature selector and selects the news from the state
- Subscription in the `NewsComponent` and use the `async` pipe in the template with `*ngFor` to print the news 

---
# Testing Reducers
- Reducers are pure and synchronous
- Testability is one of the main benefits of reducers
- Example:

```typescript
import { IncrementAction } from '../actions/counter.actions';
import { counterReducer } from './counter.reducer';

describe('counter reducer', () => {
  describe('increment', () => {
    it('should increase the counter with value', () => {
      const state = counterReducer(
        10,
        new IncrementAction(50)
      );
      expect(state).toEqual(60);
    });
  });
});
```

---
# Exercise
Test your reducer for setting the array when there is `News` action dispatched.

---
# What Should Be Part of Store: SHARI
- Shared: Shared state accessed by many components & services 
- Hydrated: State persisted and hydrated from storage
- Available: State that needs to be available when re-entering routes
- Retrieved: State that needs to be retrieved with a side effect
- Impacted: State impacted by actions from other sources

---
# What Should Not Be Part of Store?
- Forms
- Non-serializable data
- Ephemeral data

---
# @ngrx/store-devtools
- See all actions happened ever
- Import/export state
- Cancel actions
- Reorder actions
- Time travelling
- Generate tests

---
# @ngrx/store-devtools - Setup

```bash
npm install @ngrx/store-devtools
```

```typescript
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ counter: counterReducer }),
    `StoreDevtoolsModule.instrument()`
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Install [Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

---
# @ngrx/store-devtools - Demo

---
# Exercise
Install the Chrome extension and instrument the dev tools and verify you see them in the developer tools of Chrome.

---
# @ngrx/effects
- Side effect model for @ngrx
- Models side effects as Observables
- Each `effect` is a property with annotation `@Effect()` of the Effects class
- Each `effect` checks with `ofType` whether an action is for it and if so, returns a new action at some point
- Simplest effect that just changes the action type

```typescript
export class CounterEffects {
  constructor(private actions$: Actions) {
  }

  @Effect() loadCounterIncrement$: Observable<Action> = this.actions$
    .ofType('[Counter] Fetch increment')
    .pipe(
      map(() => new IncrementAction(10))
    );
}
```

---
# @ngrx/effects - Setup
```bash
npm install @ngrx/effects
```

```typescript
import { EffectsModule } from '@ngrx/effects';
import { CounterEffects } from './effects/counter-news';

@NgModule({
  imports: [
    `EffectsModule.forRoot([CounterEffects])`
  ]
})
export class AppModule {}
```

---
# @ngrx/effects - Effect

```typescript
import { LOAD_COUNTER_INCREMENT, LoadFailed, Set } from '../actions/counter.actions';

@Injectable()
export class CounterEffects {
  constructor(private httpClient: HttpClient,
              private actions$: Actions) {
  }

  @Effect() loadCounterIncrement$: Observable<Action> = this.actions$
    .ofType(LOAD_COUNTER_INCREMENT)
    .pipe(
      mergeMap(
        () => this.httpClient
          .get('counter.example.com/increment')
          .pipe(
            // If successful, dispatch set action with result list
            map((data: any[]) => new IncrementAction(data)),
            // If request fails, dispatch failed action
            catchError(() => of(new LoadFailed()))
          )
      )
    );
}
```

---
# Exercise
Implement news fetching from URL `https://hacker-news.firebaseio.com/v0/topstories.json` as an effect and populate the current news state with result. Skip the error handling until next exercise.

---
# Exercise
Implement error/success messages component that
- Is rendered on top of the screen if there are messages
- Is controlled by its own reducer with its own actions and the reducer is tested
- Is shown when loading of top stories succeeds and/or fails

Tip: Start by thinking what should be handled by reducers and what by effects?

---
# Non-dispatching Effects
- Event does not need to dispatch a new action in the end
- If so, pass `{ dispatch: false }` as a argument for the `@Effect()`
- Example:

```typescript
@Effect({ dispatch: false }) logActions$ = this.actions$
    .pipe(tap(action => console.log(action)));
```

---
# Testing Effects
- Easiest with Angular TestBed to utilize dependency injection
- `providerMockActions` will deliver a new Observable to subscribe to for each test

```typescript
describe('counter effects', () => {
  let effects: CounterEffects;
  let actions: Subject<any>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        CounterEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(CounterEffects);
    httpMock = TestBed.get(HttpTestingController);
  });
```

---
# Testing Effects

```typescript
it('should make the HTTP request for counter increment', () => {
    actions = new ReplaySubject(1);
    actions.next(new LoadCounterIncrement());
    
    effects.loadCounterIncrement$.subscribe(result => {
      expect(result).toEqual(new IncrementAction(10));
    });
    
    const request = httpMock.expectOne('counter.example.com/increment');
    request.flush(10);
    httpMock.verify();
});
```

---
# Exercise
Implement the testing for your Hacker news effects.

---
# @ngrx/router-store
- Connects Angular router to @ngrx/store
- `ROUTER_NAVIGATION` action dispatched on navigation before any guards or resolvers run
- Reducer throwing an error for `ROUTER_NAVIGATION` cancels navigation
- `ROUTER_CANCEL` (guard prevented navigation) and `ROUTER_ERROR` (navigation error)

---
# @ngrx/router-store - Setup

```bash
npm install @ngrx/router-store
```

```typescript
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { App } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ router: routerReducer }),
    RouterModule.forRoot([
      // routes
    ]),
    StoreRouterConnectingModule
  ],
  bootstrap: [App]
})
export class AppModule { }
```

---
# Exercise
1. Add routing to your application by adding
 
```typescript
RouterModule.forRoot([
  { path: '', component: HackerNewsComponent }
]),
```

to the `imports` list in _app.module.ts_ and replacing _app.component.html_ content with `<router-outler></router-outlet>`.
2. Add reducer to prevent accessing single page in the system and instead navigate to home page and generate an error message.

---
# Feature modules & Lazy Loading
- Both `@ngrx/store` and `@ngrx/effects` support feature modules
- Also lazy loading is supported

---
# @ngrx/entity
- Latest addition to @ngrx
- API to manipulate and query entity collection
- Not covered in more detail

---
# Further Material
- Selectors ([ngConf 2018 presentation](https://www.youtube.com/watch?v=Y4McLi9scfc), [docs](https://github.com/ngrx/platform/blob/master/docs/store/selectors.md)): How to get things from store more efficiently
- [Feature modules](https://github.com/ngrx/platform/blob/master/docs/store/api.md#feature-module-state-composition): Lazy loading parts of store
- [angular-ngrx-data](https://github.com/johnpapa/angular-ngrx-data): Upcoming module of @ngrx family to reduce boilerplate
- [Meta-reducers](https://netbasal.com/implementing-a-meta-reducer-in-ngrx-store-4379d7e1020a): Higher order reducers
- [Reducing boilerplate (ngConf 2018)](https://www.youtube.com/watch?v=t3jx0EC-Y3c)

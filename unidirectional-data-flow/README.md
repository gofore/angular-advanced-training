# State Management & Unidirectional Data Flow

---
# Content
- What is state and its management?
- Service-based state management and its problems
- Unidirectional data flow
- Redux
- @ngrx state management

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
# Redux - Usage

```typescript
import { createStore } from 'redux';

function counter(state = 0, action) {
    switch (action.type) {
        case '[Counter] Increment':
            return state + action.payload;
        case '[Counter] Decrement':
            return state - action.payload;
        default:
            return state;
    }
}

const store = createStore(counter);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: '[Counter] Increment', payload: 10 });
```

---
# Redux Demo

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
- Full state management solution for Angular applications
- Basically Redux + RxJS 
- Set of npm modules:
    - @ngrx/store - Redux clone
    - @ngrx/effects - redux-observable like side effect management
    - @ngrx/router-store - Connects Angular router to store
    - @ngrx/devtools - Tooling for 
    - @ngrx/entity -  Entity State adapter for managing record collections
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
export const HACKER_NEWS_ACTIONS = {
  SET: '[Hacker News] Set',
  LOAD_TOP_STORIES: '[Hacker News] Load top stories'
};

export class SetAction implements Action {
  readonly type = HACKER_NEWS_ACTIONS.SET;

  constructor(public news: any[]) {
  }
}

export class LoadTopStoriesAction implements Action {
  readonly type = HACKER_NEWS_ACTIONS.LOAD_TOP_STORIES;
}


export type HackerNewsAction = SetAction | LoadTopStoriesAction;
```

---
# Typed Action Reducer

```typescript
import { HackerNewsAction, HACKER_NEWS_ACTIONS } from '../actions/hacker-news.actions';

export function hackerNewsReducer(state: any[] = [], action: HackerNewsAction) {
  switch (action.type) {
    case HACKER_NEWS_ACTIONS.SET:
      return action.news;

    default:
      return state;
  }
}
```

---
# Typed Action Dispatching

```typescript
this.store.dispatch(new SetAction(newsArr));
this.store.dispatch(new LoadTopStories());
```

---
# Exercise

---
# Testing Reducers
- Reducers are pure and synchronous
- Testability is one of the main benefits of reducers
- Example:

```typescript
import { SetAction } from '../actions/hacker-news.actions';
import { hackerNewsReducer } from './hacker-news.reducer';

describe('hacker news reducer', () => {
  describe('set', () => {
    it('should set news to actual data', () => {
      const state = hackerNewsReducer(
        [],
        new SetAction([15884927, 15884051, 15885829])
      );
      expect(state).toEqual([15884927, 15884051, 15885829]);
    });
  });
});
```

---
# Exercise

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
# @ngrx/effects
- Side effect model for @ngrx
- Models side effects as Observables

---
# @ngrx/effects - Setup
```bash
npm install @ngrx/effects
```

```typescript
import { EffectsModule } from '@ngrx/effects';
import { HackerNewsEffects } from './effects/hacker-news';

@NgModule({
  imports: [
    `EffectsModule.forRoot([HackerNewsEffects])`
  ]
})
export class AppModule {}
```

---
# @ngrx/effects - Effect

```typescript
import { HACKER_NEWS_ACTIONS, LoadFailed, Set } from '../actions/hacker-news.actions';

@Injectable()
export class HackerNewsEffects {
  constructor(private httpClient: HttpClient,
              private actions$: Actions) {
  }

  // Listen for the 'LOAD_TOP_STORIES' action
  @Effect() loadTopStories$: Observable<Action> = this.actions$
    .ofType(HACKER_NEWS_ACTIONS.LOAD_TOP_STORIES)
    .pipe(
      mergeMap(
        () => this.httpClient
          .get('https://hacker-news.firebaseio.com/v0/topstories.json')
          .pipe(
            // If successful, dispatch set action with result list
            map((data: any[]) => new SetAction(data)),
            // If request fails, dispatch failed action
            catchError(() => of(new LoadFailed()))
          )
      )
    );
}

```

---
# Exercise
Implement error/success messages component that
- Is rendered on top of the screen if there are messages
- Is controlled by its own reducer with its own actions and the reducer is tested
- Is shown when loading of top stories succeeds and/or fails

---
# Testing Effects
- Easiest with Angular TestBed to utilize dependency injection
- Marble testing can be used where as the traditional subscribing by hand

---
# Testing Effects - Subscribing by Hand

```typescript
describe('without marble', () => {
  let effects: HackerNewsEffects;
  let actions: Subject<any>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        HackerNewsEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(HackerNewsEffects);
    httpMock = TestBed.get(HttpTestingController);
  });
```

---
# Testing Effects - Subscribing by Hand

```typescript
it('should make a call to Hacker News', () => {
    actions = new ReplaySubject(1);
    actions.next(new LoadTopStories());
    
    effects.loadTopStories$.subscribe(result => {
      expect(result).toEqual(new SetAction([1, 2, 3]));
    });
    
    const request = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/topstories.json');
    request.flush([1, 2, 3]);
    httpMock.verify();
});
```

---
# Exercise

---
# @ngrx/router-store
- Connect Angular router to @ngrx/store
- `ROUTER_NAVIGATION` action dispatched on navigation before any guards or resolvers run
- Reducer throwing an error cancels navigation
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
    StoreModule.forRoot({ routerReducer: routerReducer }),
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
Add reducer to prevent accessing single page in the system and instead navigate to home page and generate an error message.

---
# @ngrx/entity
- Latest addition to @ngrx - released 
- API to manipulate and query entity collection
- Not covered in more detail
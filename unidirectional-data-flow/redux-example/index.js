const { createStore, combineReducers } = require('redux');

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

const store = createStore(combineReducers({counter}));

store.subscribe(() => console.log(store.getState().counter));

store.dispatch({ type: '[Counter] Increment', payload: 10 });
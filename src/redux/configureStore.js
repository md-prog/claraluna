import multi from 'redux-multi';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {enableBatching} from 'redux-batched-actions';
import reducer from './reducer';
import {routerMiddleware} from 'react-router-redux';
import {DevTools} from 'devtools';

let devTools = f => f;
if (typeof window === 'object'
    && typeof window.devToolsExtension !== 'undefined') {
    devTools = window.devToolsExtension();
}

export default function configureStore(initialState, history) {

    const enhancers = [
        applyMiddleware(thunk),
        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(multi)
    ];
    if (!PRODUCTION) {
        enhancers.push(DevTools.instrument());
    }

    const enhancer = compose(...enhancers)(createStore);
    return enhancer(enableBatching(reducer), initialState);
}




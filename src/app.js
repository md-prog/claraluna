import '@babel/polyfill';
import SmoothScroll from 'smoothscroll-for-websites';
window.SmoothScroll = SmoothScroll;

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import getRoutes from './routes';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import database from 'dev-database';
import { _DEV_DEVTOOLS, _DEV_LOADER, _DEV_USE_DATABASE, LANG_IT, LANG_DE, IMAGES_BASE_URL } from './constants';

// Constants
import { API_BASE } from './constants';

// -------------------
// DEBUGGING
// -------------------
//
// import { DevTools } from 'devtools';

// -------------------
//
// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update');
//     whyDidYouUpdate(React, { include: /^Home/ });
// }
global.pD = IMAGES_BASE_URL;
global.loader = _DEV_LOADER;

import apiCall from './utilities/apiCall';

/* -----------
    Fastclick rimosso per risolvere un bug sulla searchbox di google maps
   ----------- */
//if (__CLIENT__ && 'addEventListener' in document) {
    // const FastClick = require('fastclick');
    // document.addEventListener('DOMContentLoaded', () => {
    //     FastClick.attach(document.body);
    // }, false);
//}

const init = (response) => {
    let initialState = response;

    if (_DEV_USE_DATABASE) {
        initialState = database;
    }

    const store = configureStore(initialState, browserHistory);
    const history = syncHistoryWithStore(browserHistory, store);

    document.documentElement.classList.add('app-is-mounted');

    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                { getRoutes(store.getState().menuItems) }
            </Router>
        </Provider>,
        document.getElementById('app')
    );
    //
    // if (__CLIENT__ && !PRODUCTION) {
    //     const devToolsRoot = document.createElement('div');
    //     devToolsRoot.id = 'devtools';
    //     document.body.appendChild(devToolsRoot);
    //     ReactDOM.render(
    //         <Provider store={store}>
    //             <DevTools />
    //         </Provider>,
    //         devToolsRoot
    //     );
    // }
    //
    // if (__CLIENT__ && !PRODUCTION) {
    //     window.Perf = require('react-addons-perf');
    // }
};

let lang = LANG_IT;
if (window.location.pathname.startsWith('/de')) {
    lang = LANG_DE;
}

(global.__data
    ? Promise.resolve(global.__data)
    : apiCall(API_BASE, lang).get()
        .then(response => typeof response === 'string' ? JSON.parse(response) : response))
    .then(response => init(response))
    .catch(reason => console.warn(reason));

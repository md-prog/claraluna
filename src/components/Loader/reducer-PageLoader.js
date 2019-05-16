/**
 * 3 = site loader
 * 2 = page loader visible
 * 1 = page loader hidden
 */
const initialState = {
    pageLoaderState: 3
};

export const showPageLoader = (state = initialState) =>
    Object.assign({}, state, {
        pageLoaderState: 1
    });

export const hidePageLoader = (state = initialState) =>
    Object.assign({}, state, {
        pageLoaderState: 2
    });


/** WEBPACK FOOTER **
 ** ./components/Loader/reducer-PageLoader.js
 **/
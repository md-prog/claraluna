import {
    APP_SET_FETCHING,
    APP_UNSET_FETCHING,
    APP_SET_MOBILE,
    APP_UNSET_MOBILE,
    APP_SET_TABLET,
    APP_UNSET_TABLET,
    APP_SET_WINDOW_COORDINATES,
    APP_SET_MOVING,
    APP_UNSET_MOVING,
    APP_IS_LOADED
} from '../../constants';

export const setMobile = () => ({
    type: APP_SET_MOBILE
});

export const unsetMobile = () => ({
    type: APP_UNSET_MOBILE
});

export const setFetching = () => ({
    type: APP_SET_FETCHING
});

export const unsetFetching = () => ({
    type: APP_UNSET_FETCHING
});

export const setTablet = () => ({
    type: APP_SET_TABLET
});

export const unsetTablet = () => ({
    type: APP_UNSET_TABLET
});

export const setMovingState = () => ({
    type: APP_SET_MOVING
});

export const unsetMovingState = () => ({
    type: APP_UNSET_MOVING
});

export const setWindowCoordinates = () => ({
    type: APP_SET_WINDOW_COORDINATES
});

export const setAppLoaded = () => ({
    type: APP_IS_LOADED
});


/** WEBPACK FOOTER **
 ** ./containers/App/actions-app.js
 **/
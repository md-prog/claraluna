/**
 * logoState legend
 * 0 = logo is HIDDEN
 * 1 = logo is SHOWN
 * @type {{logoState: number}}
 */

const initialState = {
    logoState: 0
};

export const hideLogo = (state = initialState) =>
    Object.assign({}, state, {
        logoState: 0
    });

export const showLogo = (state = initialState) =>
    Object.assign({}, state, {
        logoState: 1
    });


/** WEBPACK FOOTER **
 ** ./components/Logo/reducer-logo.js
 **/
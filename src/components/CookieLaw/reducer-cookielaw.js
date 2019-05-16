const initialState = {
    isCookieEnabled: false
};

export const acceptCookie = (state = initialState) =>
    Object.assign({}, state, {
        isCookieEnabled: false
    });

export const showCookie = (state = initialState) =>
    Object.assign({}, state, {
        isCookieEnabled: true
    });


/** WEBPACK FOOTER **
 ** ./components/CookieLaw/reducer-cookielaw.js
 **/
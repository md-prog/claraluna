/**
 * I AM LEGEND
 * 0 = button is INVISIBLE
 * 1 = button is SHOW THE BOOK AN APPOINTMENT OVERLAY
 * 2 = button is SEND FORM
 * 3 = button is GO TO STORE LOCATOR
 * @type {{frameButtonState: number}}
 */

const initialState = {
    frameButtonState: 0
};

export const hideFrameButton = (state = initialState) =>
    Object.assign({}, state, {
        frameButtonState: 0
    });

export const frameButtonBookAnAppointment = (state = initialState) =>
    Object.assign({}, state, {
        frameButtonState: 1
    });

export const frameButtonSend = (state = initialState) =>
    Object.assign({}, state, {
        frameButtonState: 2
    });

export const frameButtonStoreLocator = (state = initialState) =>
    Object.assign({}, state, {
        frameButtonState: 3
    });


/** WEBPACK FOOTER **
 ** ./components/FrameButton/reducer-frameButtonState.js
 **/
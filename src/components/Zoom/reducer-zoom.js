// ZOOMING
const initialState = {
    isZoomActive: false
};

export const setZoomActive = (state = initialState) =>
    Object.assign({}, state, {
        isZoomActive: true
    });

export const unsetZoomActive = (state = initialState) =>
    Object.assign({}, state, {
        isZoomActive: false
    });


/** WEBPACK FOOTER **
 ** ./components/Zoom/reducer-zoom.js
 **/
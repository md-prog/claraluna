const initialState = {
    isFrameVisible: true
};

export const setFrameVisible = (state = initialState) =>
     Object.assign({}, state, {
         isFrameVisible: true
     });

export const unsetFrameVisible = (state = initialState) =>
     Object.assign({}, state, {
         isFrameVisible: false
     });


/** WEBPACK FOOTER **
 ** ./components/Frame/reducer-frame.js
 **/
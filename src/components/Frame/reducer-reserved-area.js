const initialState = {
    reservedAreaState: 0
};

export const showReservedArea = (state = initialState) =>
    Object.assign({}, state, {
        reservedAreaState: 1
    });

export const hideReservedArea = (state = initialState) =>
    Object.assign({}, state, {
        reservedAreaState: 0
    });


/** WEBPACK FOOTER **
 ** ./components/Frame/reducer-reserved-area.js
 **/
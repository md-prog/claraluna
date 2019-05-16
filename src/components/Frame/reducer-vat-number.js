const initialState = {
    vatNumberState: 0
};

export const showVatNumber = (state = initialState) =>
    Object.assign({}, state, {
        vatNumberState: 1
    });

export const hideVatNumber = (state = initialState) =>
    Object.assign({}, state, {
        vatNumberState: 0
    });


/** WEBPACK FOOTER **
 ** ./components/Frame/reducer-vat-number.js
 **/
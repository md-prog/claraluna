const initialState = {
    activeProduct: null
};

export const setActiveProduct = (state = initialState, action) =>
    Object.assign({}, state, {
        activeProduct: parseInt(action.id, 10)
    });

export const unsetActiveProduct = (state = initialState) =>
    Object.assign({}, state, {
        activeProduct: null
    });


/** WEBPACK FOOTER **
 ** ./containers/PageProduct/reducer-product.js
 **/
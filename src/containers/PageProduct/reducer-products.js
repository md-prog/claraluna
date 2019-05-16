import {
    PRODUCT_SET_VISIBILITY,
    PRODUCT_UNSET_VISIBILITY
} from '../../constants';

const initialState = [];

const setProductVisibility = (state = initialState, action) =>
    state.map(prod => (
        (prod.idProduct === action.idProduct) ?
            Object.assign({}, prod, {
                isVisible: true
            }) : prod
    ));

const unsetProductVisibility = (state = initialState, action) =>
    state.map(prod => (
        (prod.idProduct === action.idProduct) ?
            Object.assign({}, prod, {
                isVisible: false
            }) : prod
    ));

const map = {
    [PRODUCT_SET_VISIBILITY]: setProductVisibility,
    [PRODUCT_UNSET_VISIBILITY]: unsetProductVisibility
};

const productsReducer = (state = {}, action) =>
    action && map[action.type] ? map[action.type](state, action) : state;

export default productsReducer;


/** WEBPACK FOOTER **
 ** ./containers/PageProduct/reducer-products.js
 **/
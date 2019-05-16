import {
    WISHLIST_ADD_ITEM,
    WISHLIST_REMOVE_ITEM
} from '../../constants';

const initialState = [];

const wishlist = {
    addItem: (state = initialState, action) => ([
        ...state,
        action.idProduct
    ]),
    removeItem: (state = initialState, action) => {
        const index = state.indexOf(action.idProduct);
        return index > -1 ? [
            ...state.slice(0, index),
            ...state.slice(index + 1)
        ] : state;
    }
};


const map = {
    [WISHLIST_ADD_ITEM]: wishlist.addItem,
    [WISHLIST_REMOVE_ITEM]: wishlist.removeItem
};

const wishlistReducer = (state = [], action) =>
    action && map[action.type] ? map[action.type](state, action) : state;

export default wishlistReducer;


/** WEBPACK FOOTER **
 ** ./containers/PageWishlist/reducer-wishlist.js
 **/
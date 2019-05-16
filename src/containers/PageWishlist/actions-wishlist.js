import {
    WISHLIST_ADD_ITEM,
    WISHLIST_REMOVE_ITEM
} from '../../constants';

export const addWishItem = id => ({
    type: WISHLIST_ADD_ITEM,
    idProduct: id
});

export const removeWishItem = id => ({
    type: WISHLIST_REMOVE_ITEM,
    idProduct: id
});


/** WEBPACK FOOTER **
 ** ./containers/PageWishlist/actions-wishlist.js
 **/
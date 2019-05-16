import {
    APP_SET_ACTIVE_PRODUCT,
    APP_UNSET_ACTIVE_PRODUCT,
    GALLERY_SET_CURRENT,
    PRODUCT_SET_VISIBILITY,
    PRODUCT_UNSET_VISIBILITY
} from '../../constants';

export const setActiveProduct = (id) => ({
    type: APP_SET_ACTIVE_PRODUCT,
    id: id
});

export const unsetActiveProduct = () => ({
    type: APP_UNSET_ACTIVE_PRODUCT
});

export const setCurrentSlide = (idGallery, idPic) => ({
    type: GALLERY_SET_CURRENT,
    idGallery: idGallery,
    idPic: idPic
});

export const setProductVisibility = (id) => ({
    type: PRODUCT_SET_VISIBILITY,
    idProduct: id
});

export const unsetProductVisibility = (id) => ({
    type: PRODUCT_UNSET_VISIBILITY,
    idProduct: id
});


/** WEBPACK FOOTER **
 ** ./containers/PageProduct/actions-product.js
 **/
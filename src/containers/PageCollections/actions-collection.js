import {
    APP_SET_ACTIVE_COLLECTION,
    APP_UNSET_ACTIVE_COLLECTION,
    APP_SET_OPEN_COLLECTION,
    APP_UNSET_OPEN_COLLECTION
} from '../../constants/index';

export const setActiveCollection = (id) => ({
    type: APP_SET_ACTIVE_COLLECTION,
    id: id
});

export const unsetActiveCollection = () => ({
    type: APP_UNSET_ACTIVE_COLLECTION
});

export const setIsCollectionOpen = () => ({
    type: APP_SET_OPEN_COLLECTION
});

export const unsetIsCollectionOpen = () => ({
    type: APP_UNSET_OPEN_COLLECTION
});


/** WEBPACK FOOTER **
 ** ./containers/PageCollections/actions-collection.js
 **/
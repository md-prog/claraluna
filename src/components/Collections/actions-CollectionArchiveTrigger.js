import {
    VIEW_ALL_COLLECTION_HIDE,
    VIEW_ALL_COLLECTION_SHOW,
    VIEW_ALL_COLLECTION_PHONE
} from '../../constants';

export const hideViewAllCollectionBtn = () => ({
    type: VIEW_ALL_COLLECTION_HIDE
});

export const showViewAllCollectionBtn = () => ({
    type: VIEW_ALL_COLLECTION_SHOW
});

export const showViewAllCollectionPhoneNumber = () => ({
    type: VIEW_ALL_COLLECTION_PHONE
});



/** WEBPACK FOOTER **
 ** ./components/Collections/actions-CollectionArchiveTrigger.js
 **/
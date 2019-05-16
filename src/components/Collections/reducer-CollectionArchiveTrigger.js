/**
 * I AM LEGEND
 * 0 = button is INVISIBLE
 * 1 = button shows the View All Collection button
 * 2 = button show the phone number
 * @type {{viewAllCollectionState: number}}
 */

const initialState = {
    viewAllCollectionState: 0
};

export const hideViewAllCollectionBtn = (state = initialState) =>
    Object.assign({}, state, {
        viewAllCollectionState: 0
    });

export const showViewAllCollectionBtn = (state = initialState) =>
    Object.assign({}, state, {
        viewAllCollectionState: 1
    });

export const showViewAllCollectionPhoneNumber = (state = initialState) =>
    Object.assign({}, state, {
        viewAllCollectionState: 2
    });


/** WEBPACK FOOTER **
 ** ./components/Collections/reducer-CollectionArchiveTrigger.js
 **/
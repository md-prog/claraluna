const initialState = {
    isCollectionOpen: false,
    activeCollection: null
};

export const openCollection = (state = initialState) =>
    Object.assign({}, state, {
        isCollectionOpen: true
    });

export const closeCollection = (state = initialState) =>
    Object.assign({}, state, {
        isCollectionOpen: false
    });

export const setActiveCollection = (state = initialState, action) =>
     Object.assign({}, state, {
         activeCollection: parseInt(action.id, 10)
     });

export const unsetActiveCollection = (state = initialState) =>
     Object.assign({}, state, {
         activeCollection: null
     });


/** WEBPACK FOOTER **
 ** ./containers/PageCollections/reducer-collection.js
 **/
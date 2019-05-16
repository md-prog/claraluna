const initialState = {
    activeCategory: null
};

export const setActiveCategory = (state = initialState, action) =>
    Object.assign({}, state, {
        activeCategory: parseInt(action.id, 10)
    });

export const unsetActiveCategory = (state = initialState, action) =>
    Object.assign({}, state, {
        activeCategory: null
    });


/** WEBPACK FOOTER **
 ** ./containers/PageHome/reducer-activecategory.js
 **/
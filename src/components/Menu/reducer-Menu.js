const initialState = {
    isMenuOpen: 0
};

export const hideMenuTrigger = (state = initialState) =>
    Object.assign({}, state, {
        isMenuOpen: 0
    });

export const showMenuTrigger = (state = initialState) =>
    (state.isMenuOpen !== 2)
        ? Object.assign({}, state, {
            isMenuOpen: 1
        })
        : state;

export const menuOpen = (state = initialState) =>
    Object.assign({}, state, {
        isMenuOpen: 3
    });

export const menuClosing = (state = initialState) =>
    Object.assign({}, state, {
        isMenuOpen: 2
    });

export const menuClose = (state = initialState) =>
    Object.assign({}, state, {
        isMenuOpen: 1
    });


/** WEBPACK FOOTER **
 ** ./components/Menu/reducer-Menu.js
 **/
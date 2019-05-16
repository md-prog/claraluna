import {
    MAIN_MENU_HIDE_TRIGGER,
    MAIN_MENU_SHOW_TRIGGER,
    MAIN_MENU_OPEN,
    MAIN_MENU_CLOSE,
    MAIN_MENU_CLOSING
} from '../../constants';
import { Timeout } from '../../utilities/utils';

export const hideMenuTrigger = () => ({
    type: MAIN_MENU_HIDE_TRIGGER
});

export const showMenuTrigger = () => ({
    type: MAIN_MENU_SHOW_TRIGGER
});

export const openMenu = () => ({
    type: MAIN_MENU_OPEN
});

const closingMenu = () => ({
    type: MAIN_MENU_CLOSING
});

export const closeMenu = () => dispatch => {
    dispatch(closingMenu());
    new Timeout(800)
        .then(() => dispatch({
            type: MAIN_MENU_CLOSE
        }));
};


/** WEBPACK FOOTER **
 ** ./components/Menu/actions-menu.js
 **/
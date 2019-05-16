import {
    PAGE_LOADER_SHOW,
    PAGE_LOADER_HIDE
} from '../../constants';

export const showPageLoader = () => (dispatch) => {
    dispatch({
        type: PAGE_LOADER_SHOW
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 800);
    });
};

export const hidePageLoader = () => (dispatch) => {
    dispatch({
        type: PAGE_LOADER_HIDE
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 800);
    });
};


/** WEBPACK FOOTER **
 ** ./components/Loader/actions-PageLoader.js
 **/
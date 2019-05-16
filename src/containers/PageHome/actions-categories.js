import {
    APP_SET_ACTIVE_CATEGORY,
    APP_UNSET_ACTIVE_CATEGORY
} from '../../constants/index';

export const setActiveCategory = (id) => ({
    type: APP_SET_ACTIVE_CATEGORY,
    id: id
});

export const unsetActiveCategory = () => ({
    type: APP_UNSET_ACTIVE_CATEGORY
});


/** WEBPACK FOOTER **
 ** ./containers/PageHome/actions-categories.js
 **/
import {
    WISHLIST_ADD_ITEM,
    WISHLIST_REMOVE_ITEM
} from '../../constants';

const initialState = [];

const attitude = {};

const map = {};

const attitudeReducer = (state = [], action) =>
    action && map[action.type] ? map[action.type](state, action) : state;

export default attitudeReducer;


/** WEBPACK FOOTER **
 ** ./containers/PageAttitude/reducer-attitude.js
 **/
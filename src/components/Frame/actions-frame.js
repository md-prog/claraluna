import {
    APP_SET_FRAME_VISIBLE,
    APP_UNSET_FRAME_VISIBLE
} from '../../constants';

export const setFrameVisible = () => ({
    type: APP_SET_FRAME_VISIBLE
});

export const unsetFrameVisible = () => ({
    type: APP_UNSET_FRAME_VISIBLE
});



/** WEBPACK FOOTER **
 ** ./components/Frame/actions-frame.js
 **/
import {
    APP_SET_ZOOM_ACTIVE,
    APP_UNSET_ZOOM_ACTIVE
} from '../../constants';

export const setIsZoomActive = () => ({
    type: APP_SET_ZOOM_ACTIVE
});

export const unsetIsZoomActive = () => ({
    type: APP_UNSET_ZOOM_ACTIVE
});


/** WEBPACK FOOTER **
 ** ./components/Zoom/actions-zoom.js
 **/
import {
    MAIN_MENU_HIDE_TRIGGER,
    MAIN_MENU_SHOW_TRIGGER,
    MAIN_MENU_OPEN,
    MAIN_MENU_CLOSE,
    MAIN_MENU_CLOSING,
    APP_SET_MOBILE,
    APP_UNSET_MOBILE,
    APP_SET_TABLET,
    APP_UNSET_TABLET,
    APP_SET_MOVING,
    APP_UNSET_MOVING,
    APP_SET_FETCHING,
    APP_UNSET_FETCHING,
    MOBILE_WIDTH,
    APP_SET_OPEN_COLLECTION,
    APP_UNSET_OPEN_COLLECTION,
    APP_SET_ACTIVE_CATEGORY,
    APP_UNSET_ACTIVE_CATEGORY,
    APP_SET_ACTIVE_COLLECTION,
    APP_UNSET_ACTIVE_COLLECTION,
    APP_SET_ACTIVE_PRODUCT,
    APP_UNSET_ACTIVE_PRODUCT,
    APP_SET_WINDOW_COORDINATES,
    APP_SET_ZOOM_ACTIVE,
    APP_UNSET_ZOOM_ACTIVE,
    PAGE_LOADER_SHOW,
    PAGE_LOADER_HIDE,
    APP_SET_FRAME_VISIBLE,
    APP_UNSET_FRAME_VISIBLE,
    VAT_NUMBER_SHOW,
    VAT_NUMBER_HIDE,
    RESERVED_AREA_SHOW,
    RESERVED_AREA_HIDE,
    LOGO_SHOW,
    LOGO_HIDE,
    FRAME_BUTTON_HIDE,
    FRAME_BUTTON_BOOK_AN_APPOINTMENT,
    FRAME_BUTTON_SEND,
    FRAME_BUTTON_SORE_LOCATOR,
    VIEW_ALL_COLLECTION_HIDE,
    VIEW_ALL_COLLECTION_SHOW,
    VIEW_ALL_COLLECTION_PHONE,
    COOKIE_ACCEPT,
    COOKIE_SHOW,
    APP_IS_LOADED
} from '../../constants';

import * as pageLoader from '../../components/Loader/reducer-PageLoader';
import * as menu from '../../components/Menu/reducer-Menu';
import * as frame from '../../components/Frame/reducer-frame';
import * as zoom from '../../components/Zoom/reducer-zoom';
import * as category from '../PageHome/reducer-activecategory';
import * as collection from '../PageCollections/reducer-collection';
import * as product from '../PageProduct/reducer-product';
import * as logo from '../../components/Logo/reducer-logo';
import * as frameButton from '../../components/FrameButton/reducer-frameButtonState';
import * as vatNumber from '../../components/Frame/reducer-vat-number';
import * as reservedArea from '../../components/Frame/reducer-reserved-area';
import * as viewAllCollection from '../../components/Collections/reducer-CollectionArchiveTrigger';
import * as cookielaw from '../../components/CookieLaw/reducer-cookielaw';

const initialState = {
    isMobile: false,
    isTablet: false,
    isMoving: false,
    isCookieEnabled: false,
    isAppLoading: false,
    windowWidth: 0,
    windowHeight: 0,
    collectionHoverY: 0,
    collectionOpenY: 0
};

const appLoader = {
    setLoaded: (state = initialState) =>
        Object.assign({}, state, {
            isAppLoading: false
        })
};

const mobile = {
    setMobile: (state = initialState) =>
        Object.assign({}, state, {
            isMobile: true
        }),
    unsetMobile: (state = initialState) =>
        Object.assign({}, state, {
            isMobile: false
        })
};
const tablet = {
    setTablet: (state = initialState) =>
         Object.assign({}, state, {
             isTablet: true
         }),
    unsetTablet: (state = initialState) =>
         Object.assign({}, state, {
             isTablet: false
         })
};
const moving = {
    setMoving: (state = initialState) =>
        Object.assign({}, state, {
            isMoving: true
        }),
    unsetMoving: (state = initialState) =>
        Object.assign({}, state, {
            isMoving: false
        })
};
const fetching = {
    setFetching: (state = initialState) =>
                   Object.assign({}, state, {
                       isFetching: true
                   }),
    unsetFetching: (state = initialState) =>
                   Object.assign({}, state, {
                       isFetching: false
                   })
};
const windowCoordinate = {
    updateWindowCoordinates: (state = initialState) => {
        const winHeight = __CLIENT__ ? window.innerHeight : 0;
        const winWidth = __CLIENT__ ? window.innerWidth : 0;

        return Object.assign({}, state, {
            windowWidth: winWidth,
            windowHeight: winHeight,
            collectionHoverY: (winHeight - (winWidth < MOBILE_WIDTH ? 150 : 200)) * -1,
            collectionOpenY: (winHeight - (winWidth < MOBILE_WIDTH ? 150 : 150)) * -1
        });
    }
};

const map = {
    [APP_IS_LOADED]: appLoader.setLoaded,
    [MAIN_MENU_HIDE_TRIGGER]: menu.hideMenuTrigger,
    [MAIN_MENU_SHOW_TRIGGER]: menu.showMenuTrigger,
    [MAIN_MENU_OPEN]: menu.menuOpen,
    [MAIN_MENU_CLOSE]: menu.menuClose,
    [MAIN_MENU_CLOSING]: menu.menuClosing,
    [APP_SET_MOBILE]: mobile.setMobile,
    [APP_UNSET_MOBILE]: mobile.unsetMobile,
    [APP_SET_TABLET]: tablet.setTablet,
    [APP_UNSET_TABLET]: tablet.unsetTablet,
    [APP_SET_MOVING]: moving.setMoving,
    [APP_UNSET_MOVING]: moving.unsetMoving,
    [APP_SET_FETCHING]: fetching.setFetching,
    [APP_UNSET_FETCHING]: fetching.unsetFetching,
    [APP_SET_FRAME_VISIBLE]: frame.setFrameVisible,
    [APP_UNSET_FRAME_VISIBLE]: frame.unsetFrameVisible,
    [APP_SET_ZOOM_ACTIVE]: zoom.setZoomActive,
    [APP_UNSET_ZOOM_ACTIVE]: zoom.unsetZoomActive,
    [APP_SET_OPEN_COLLECTION]: collection.openCollection,
    [APP_UNSET_OPEN_COLLECTION]: collection.closeCollection,
    [APP_SET_ACTIVE_CATEGORY]: category.setActiveCategory,
    [APP_UNSET_ACTIVE_CATEGORY]: category.unsetActiveCategory,
    [APP_SET_ACTIVE_COLLECTION]: collection.setActiveCollection,
    [APP_UNSET_ACTIVE_COLLECTION]: collection.unsetActiveCollection,
    [APP_SET_ACTIVE_PRODUCT]: product.setActiveProduct,
    [APP_UNSET_ACTIVE_PRODUCT]: product.unsetActiveProduct,
    [APP_SET_WINDOW_COORDINATES]: windowCoordinate.updateWindowCoordinates,
    [PAGE_LOADER_SHOW]: pageLoader.showPageLoader,
    [PAGE_LOADER_HIDE]: pageLoader.hidePageLoader,
    [LOGO_SHOW]: logo.showLogo,
    [LOGO_HIDE]: logo.hideLogo,
    [VAT_NUMBER_SHOW]: vatNumber.showVatNumber,
    [VAT_NUMBER_HIDE]: vatNumber.hideVatNumber,
    [RESERVED_AREA_SHOW]: reservedArea.showReservedArea,
    [RESERVED_AREA_HIDE]: reservedArea.hideReservedArea,
    [FRAME_BUTTON_HIDE]: frameButton.hideFrameButton,
    [FRAME_BUTTON_BOOK_AN_APPOINTMENT]: frameButton.frameButtonBookAnAppointment,
    [FRAME_BUTTON_SEND]: frameButton.frameButtonSend,
    [FRAME_BUTTON_SORE_LOCATOR]: frameButton.frameButtonStoreLocator,
    [VIEW_ALL_COLLECTION_HIDE]: viewAllCollection.hideViewAllCollectionBtn,
    [VIEW_ALL_COLLECTION_SHOW]: viewAllCollection.showViewAllCollectionBtn,
    [VIEW_ALL_COLLECTION_PHONE]: viewAllCollection.showViewAllCollectionPhoneNumber,
    [COOKIE_ACCEPT]: cookielaw.acceptCookie,
    [COOKIE_SHOW]: cookielaw.showCookie
};

const appReducer = (state = {}, action) => action && map[action.type] ? map[action.type](state, action) : state;

export default appReducer;


/** WEBPACK FOOTER **
 ** ./containers/App/reducer-app.js
 **/
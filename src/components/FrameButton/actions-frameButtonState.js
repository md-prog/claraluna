import {
    FRAME_BUTTON_HIDE,
    FRAME_BUTTON_BOOK_AN_APPOINTMENT,
    FRAME_BUTTON_SEND,
    FRAME_BUTTON_SORE_LOCATOR
} from '../../constants';

export const hideFrameButton = () => ({
    type: FRAME_BUTTON_HIDE
});

export const frameButtonBookAnAppointment = () => ({
    type: FRAME_BUTTON_BOOK_AN_APPOINTMENT
});

export const frameButtonSend = () => ({
    type: FRAME_BUTTON_SEND
});
export const frameButtonStoreLocator = () => ({
    type: FRAME_BUTTON_SORE_LOCATOR
});



/** WEBPACK FOOTER **
 ** ./components/FrameButton/actions-frameButtonState.js
 **/
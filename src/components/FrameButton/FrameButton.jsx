import React from 'react';
import { browserHistory } from 'react-router';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';

// Utilities
import { bindFunctions } from '../../utilities/utils';

// Actions
import { showPageLoader } from '../../components/Loader/actions-PageLoader';

import Trigger from '../Buttons/Trigger.jsx';

class FrameButton extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, [
            'openBookAnAppointmentOverlay',
            'getCallback',
            'getModifier',
            'getLabel'
        ]);
    }

    componentDidMount() {
        if (__CLIENT__) {
            this.el = findDOMNode(this);
            this.button = this.el.querySelector('button');
        }
    }

    componentWillEnter(callback) {
        if (__CLIENT__) {
            TweenMax.fromTo(this.button, 0.7, {
                rotationX: -90,
                opacity: 0
            }, {
                rotationX: 0,
                opacity: 1,
                onComplete: callback
            });
        }
    }

    componentWillLeave(callback) {
        if (__CLIENT__) {
            TweenMax.to(this.button, 0.7, {
                rotationX: -90,
                opacity: 0,
                onComplete: callback
            });
        }
    }

    getCallback(buttonState) {
        const map = {
            [1]: this.openBookAnAppointmentOverlay,
            [2]: this.props.sendFormData,
            [3]: this.props.storeLocatorCallback
        };

        return map[buttonState] ? map[buttonState] : null;
    }

    getModifier(buttonState) {
        const map = {
            [1]: '',
            [2]: '',
            [3]: 'c-btn--gray'
        };

        return map[buttonState] ? map[buttonState] : '';
    }

    getLabel(buttonState) {
        const { labels } = this.props;
        const map = {
            [1]: labels['book_an_appointment'],
            [2]: labels['send'],
            [3]: labels['store_locator']
        };

        return map[buttonState] ? map[buttonState] : '';
    }

    openBookAnAppointmentOverlay() {
        const { isMoving, frameButtonSend } = this.props;

        if (!isMoving) {
            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': 'abiti',
                    'eventAction': window.location.pathname,
                    'eventLabel': 'prenota'
                });
            }

            // Open overlay
            frameButtonSend();
        }
    }

    render() {
        const { frameButtonState } = this.props;
        const clickCallback = this.getCallback(frameButtonState);
        const modifier = this.getModifier(frameButtonState);
        const label = this.getLabel(frameButtonState);

        return (
            <Trigger
                onClickTrigger={clickCallback}
                modifier="c-trigger--frameButton"
                btnModifier={`c-btn c-btn--primary c-btn--frameButton ${modifier}`}>
                <span>{label}</span>
            </Trigger>
        );
    }
}

FrameButton.propTypes = {
    frameButtonState: React.PropTypes.number.isRequired,
    isMoving: React.PropTypes.bool.isRequired,
    sendFormData: React.PropTypes.func.isRequired,
    labels: React.PropTypes.object.isRequired
};

export default FrameButton;


/** WEBPACK FOOTER **
 ** ./components/FrameButton/FrameButton.jsx
 **/
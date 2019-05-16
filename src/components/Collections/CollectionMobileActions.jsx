import React from 'react';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';

import CircleIcon from '../Buttons/CircleIcon.jsx';
import Trigger from '../Buttons/Trigger.jsx';

class CollectionMobileActions extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.isCollectionOpen !== prevProps.isCollectionOpen && this.props.isCollectionOpen) {
            this.closeCollectionTrigger = this.el.querySelector('.c-trigger--close-col');
            if (this.closeCollectionTrigger) {
                TweenMax.fromTo(this.closeCollectionTrigger, 0.5, { opacity: 0 }, { opacity: 1 });
            }
        }
    }

    render() {
        const { onClickTrigger, frameButtonState } = this.props;
        const clickCallback = this.getCallback(frameButtonState);
        const iconClass = this.getIconClass(frameButtonState);

        return (
            <div className="c-collections__triggers@mobile">
                <div className="c-collections__action-cell">
                    { ! (frameButtonState === 2) && <CircleIcon
                        modifier="c-circle--coll-cta t-lite t-big"
                        icon="o-ico--eye"
                        onClickCB={onClickTrigger}
                    /> }
                </div>
                <div className="c-collections__action-cell">
                    <CircleIcon
                        modifier="c-circle--coll-cta c-circle--book-apt t-primary t-big"
                        icon={iconClass}
                        onClickCB={clickCallback}
                    />
                </div>
            </div>
        );
    }

    getIconClass(buttonState) {
        const map = {
            [1]: 'o-ico--calendar',
            [2]: 'o-ico--send'
        };

        return map[buttonState] ? map[buttonState] : null;
    }

    getCallback(buttonState) {
        const { onClickBookAnAppointment, sendFormData } = this.props;
        const map = {
            [1]: onClickBookAnAppointment,
            [2]: sendFormData
        };

        return map[buttonState] ? map[buttonState] : null;
    }

}

export default CollectionMobileActions;



import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import {TweenMax, TimelineMax} from 'gsap';
import SplitText from '../../vendor/gsap/utils/SplitText';

// Utilities
import { bindFunctions } from '../../utilities/utils';

import CircleIcon from './CircleIcon.jsx';

class CircleIconWithLabel extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['mouseEnter', 'mouseLeave']);

        this.state = {
            hover: false
        };

        this.labelChars = [];
    }

    componentDidMount() {
        this.el = findDOMNode(this);
        this.label = this.el.querySelector('.c-circle-wrapper__label');

        this.splitText = new SplitText(this.label, {
            type: 'chars',
            charsClass: 'js-circle-wrapper__letters'
        });
        this.labelChars = this.splitText.chars;
        TweenMax.set(this.labelChars, { opacity: 0 });
    }

    render() {
        const { wrapperModifier, label } = this.props;
        return (
            <div
                className={`c-circle-wrapper ${wrapperModifier}`}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
            >
                <CircleIcon {...this.props} />
                <div
                    className="c-circle-wrapper__label u-text--vertical u-text--geometric"
                >{label}</div>
            </div>
        );
    }

    mouseEnter() {
        const { isMoving } = this.props;
        if (!isMoving) {
            TweenMax.staggerTo(this.labelChars, 1, {
                opacity: 1,
                ease: Power3.easeOut
            }, 0.03);
        }
    }

    mouseLeave() {
        TweenMax.to(this.labelChars, 0.3, { opacity: 0 });
    }
}

export default CircleIconWithLabel;



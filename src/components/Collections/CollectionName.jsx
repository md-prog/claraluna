import React from 'react';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';

// Utilities
import { bindFunctions } from '../../utilities/utils';

// Component
import { TweenMax, TimelineMax, Expo } from 'gsap';

class CollectionName extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['mouseEnter', 'mouseLeave']);

        this.state = {
            hover: false
        };
    }

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    render() {

        const {name, onClickName, href} = this.props;

        return (
            <a href={href} className="c-collections__name" onClick={onClickName}>
                <h1 className="js-collections-header" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>{name}</h1>
            </a>
        );
    }

    mouseEnter() {
        const underline = this.el.querySelector('u');
        const tl = new TimelineMax();

        // Kill all previous tweens
        TweenMax.killTweensOf(underline);

        // Start new Timeline
        tl
            .set(underline, { transformOrigin: '100% 50%' })
            .to(underline, 0.5, { scaleX: 0, ease: Power2.easeIn });
    }

    mouseLeave() {
        const underline = this.el.querySelector('u');
        const tl = new TimelineMax();

        tl
            .set(underline, { transformOrigin: '0% 50%' })
            .to(underline, 0.7, { scaleX: 1, ease: Expo.easeOut });
    }
}

export default CollectionName;


/** WEBPACK FOOTER **
 ** ./components/Collections/CollectionName.jsx
 **/
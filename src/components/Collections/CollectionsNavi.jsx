import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import { TweenMax, Expo } from 'gsap';

import CircleIcon from '../Buttons/CircleIcon.jsx';

class CollectionNavi extends PureComponent {

    componentDidMount() {
        this.el       = findDOMNode(this);
        this.naviNext = this.el.querySelector('.c-circle--coll-navi-next');
        this.naviPrev = this.el.querySelector('.c-circle--coll-navi-prev');
    }

    componentWillUnmount() {
        TweenMax.killTweensOf(this.naviPrev);
        TweenMax.killTweensOf(this.naviNext);
    }

    componentWillEnter(callback) {
        TweenMax.staggerFromTo([this.naviPrev, this.naviNext], 0.7, {
            y: '-50%',
            opacity: 0
        }, {
            y: '0%',
            opacity: 1,
            ease: Expo.easeInOut
        }, 0.1, callback);
    }

    componentWillLeave(callback) {
        TweenMax.staggerTo([this.naviNext, this.naviPrev], 0.7, {
            y: '-50%',
            opacity: 0,
            ease: Expo.easeInOut
        }, 0.1, callback);
    }

    render() {

        const { isMobile, clickNext, clickPrev, isMoving } = this.props;

        const modifier = isMobile ? 't-filled--white' : '';

        return (
            <div className="c-collections__navi">
                <CircleIcon
                    key="1"
                    modifier={`c-circle--coll-navi c-circle--coll-navi-next ${modifier}`}
                    icon="o-ico--arrow-right"
                    onClickCB={clickNext}
                    isMoving={isMoving}
                />
                <CircleIcon
                    key="0"
                    modifier={`c-circle--coll-navi c-circle--coll-navi-prev ${modifier}`}
                    icon="o-ico--arrow-left"
                    onClickCB={clickPrev}
                    isMoving={isMoving}
                />
            </div>
        );
    }
}

export default CollectionNavi;


/** WEBPACK FOOTER **
 ** ./components/Collections/CollectionsNavi.jsx
 **/
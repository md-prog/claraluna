import React from 'react';
import { findDOMNode } from 'react-dom';
import {bindFunctions} from '../../utilities/utils';

import { TweenMax, TimelineMax } from 'gsap';

import PureComponent from '../PureComponent.jsx';

class Zoom extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    componentWillEnter(callback) {

        const {unsetFrameVisible, windowHeight, windowWidth} = this.props;
        const winWidth = windowWidth || window.innerWidth;
        const winHeight = windowHeight || window.innerHeight;

        const done = () => {
            callback();

            // Mouse Move Event
            this.mouseMoveHandler = this.handleMouseMove.bind(this);
            document.addEventListener('mousemove', this.mouseMoveHandler, false);
        };
        const coverRect = this.el.getBoundingClientRect();
        const widthStep1 = winWidth - ((winWidth - coverRect.right) * 2);
        const widthStep2 = winWidth;
        const leftStep1 = (coverRect.left - winWidth + coverRect.right) * -1;
        const leftStep2 = coverRect.left * -1;
        const heightStep1 = winHeight;
        const topStep1 = coverRect.top * -1;

        unsetFrameVisible();
        const tl = new TimelineMax({ onComplete: done });
        tl
            .to(this.el, 0.7, { width: widthStep1, x: leftStep1, ease: Power3.easeIn })
            .to(this.el, 0.5, { width: widthStep2, x: leftStep2, ease: Power3.easeOut })
            .insert(new TweenMax.to(this.el, 0.7, { height: heightStep1, y: topStep1, ease: Power3.easeInOut }), 1);

    }

    componentWillLeave(callback) {

        const {setFrameVisible, windowWidth} = this.props;
        const winWidth = windowWidth || window.innerWidth;

        const done = () => {
            callback();
        };

        const coverRect = this.el.parentElement.getBoundingClientRect();
        const widthStep1 = winWidth - ((winWidth - coverRect.right) * 2);
        const widthStep2 = coverRect.width;
        const leftStep1 = (coverRect.left - winWidth + coverRect.right) * -1;
        const leftStep2 = 0;
        const heightStep1 = coverRect.height;
        const topStep1 = 0;

        setFrameVisible();

        document.removeEventListener('mousemove', this.mouseMoveHandler);

        const tl = new TimelineMax({ onComplete: done });
        tl
            .to(this.el, 0.5, { width: widthStep1, x: leftStep1, delay: 0.3, ease: Power3.easeIn })
            .to(this.el, 0.9, { width: widthStep2, x: leftStep2, ease: Power3.easeOut })
            .insert(new TweenMax.to(this.el, 0.5, { height: heightStep1, y: topStep1, backgroundPosition: '50% 50%', ease: Power3.easeOut }), 0);

    }

    handleMouseMove(event) {
        const { windowHeight } = this.props;
        const winHeight = windowHeight || window.innerHeight;
        const translateY = event.pageY / winHeight * 100;
        TweenMax.to(this.el, 0.4, {backgroundPosition: `50% ${translateY}%`});
    }

    render() {

        const {image, closeZoom} = this.props;

        const coverStyle = {
            backgroundImage: `url(${global.pD || ''}${image})`
        };

        return <div className="c-zoom__cover" style={coverStyle} onClick={closeZoom} />;
    }
}

Zoom.propTypes = {
    image: React.PropTypes.string.isRequired,
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
    setFrameVisible: React.PropTypes.func.isRequired,
    unsetFrameVisible: React.PropTypes.func.isRequired
};

export default Zoom;


/** WEBPACK FOOTER **
 ** ./components/Zoom/Zoom.jsx
 **/
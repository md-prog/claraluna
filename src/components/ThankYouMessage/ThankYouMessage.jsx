import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import { TweenMax } from 'gsap';

class ThankYouMessage extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
        this.title = Array.from(this.el.querySelectorAll('h3'));
        this.paragraphs = Array.from(this.el.querySelectorAll('p')).reverse();
        this.items = this.paragraphs.concat(this.title);
    }

    componentWillEnter(callback) {
        TweenMax.staggerFromTo(this.items.reverse(), 0.7, { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.7, ease: Power3.easeOut }, 0.1, callback);
    }

    componentWillLeave(callback) {
        TweenMax.staggerTo(this.items.reverse(), 0.7, { y: 50, opacity: 0, ease: Power3.easeIn }, 0.05, callback);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                { children }
            </div>
        );
    }
}

export default ThankYouMessage;


/** WEBPACK FOOTER **
 ** ./components/ThankYouMessage/ThankYouMessage.jsx
 **/
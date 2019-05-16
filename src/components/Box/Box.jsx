import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

class Box extends PureComponent {

    componentDidMount() {
        this.box        = findDOMNode(this);
        this.reveal     = this.box.querySelector('.c-box__reveal');
        this.cover      = this.box.querySelector('.c-box__cover');
        this.innerTitle = this.box.querySelector('.c-box__inner > h4');
        this.innerText  = this.box.querySelector('.c-box__inner > p');

        TweenMax.set(this.box, {y: '30%'});
        TweenMax.set(this.cover, {y: '-10%', visibility: 'hidden'});

        // Only if we have paragraphs
        if (this.innerText) {
            this.innerLines = new SplitText(this.innerText, {type: 'lines', linesClass: 'js-desc-line'});
            this.lines      = [this.innerTitle].concat(this.innerLines.lines);
            TweenMax.set(this.lines, { y: 40, opacity: 0 });
        }

    }

    componentWillUnmount() {
        TweenMax.killTweensOf([this.box, this.reveal, this.cover, this.lines]);
    }

    render() {

        const { modifier, children, boxId } = this.props;

        return (
            <div className={`c-box ${modifier}`} id={boxId}>
                <div className="c-box__reveal"></div>
                <div className="c-box__cover c-box__cover--gray"></div>
                <div className="c-box__inner">{children}</div>
            </div>
        );
    }
}

export default Box;



/** WEBPACK FOOTER **
 ** ./components/Box/Box.jsx
 **/
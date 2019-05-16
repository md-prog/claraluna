import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import { TweenMax } from 'gsap';

class CollectionProgress extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
        this.indicator = this.el.querySelector('.c-collections__indicator');
    }

    componentWillUnmount() {
        TweenMax.killTweensOf(this.el);
    }

    componentWillEnter(callback) {
        const {windowHeight} = this.props;
        TweenMax.fromTo(this.el, 0.7, {
            y: windowHeight * -1,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Power3.easeOut,
            onComplete: callback
        });
    }

    componentWillLeave(callback) {
        TweenMax.to(this.el, 0.3, {
            opacity: 0,
            ease: Power3.easeOut,
            onComplete: callback
        });
    }

    render() {
        const { activeCategory, categories } = this.props;
        const categoryIndex = categories.findIndex(c => c.idCategory === activeCategory);
        const modifier = (categoryIndex === 0) ? 't-abiti' : 't-bomboniere';

        return (
            <div className="c-collections__progress">
                <div className={`c-collections__indicator ${modifier}`}></div>
            </div>
        );

    }
}

export default CollectionProgress;



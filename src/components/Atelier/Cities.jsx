import React from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';

import { TweenMax } from 'gsap';

class Cities extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
        this.cities = Array.from(this.el.querySelectorAll('.o-cities__link'));
    }

    componentWillEnter(callback) {

        if (__CLIENT__) {
            TweenMax.staggerFromTo(this.cities, 1, {
                x: '-100%',
                opacity: 0
            }, {
                x: '0%',
                opacity: 1,
                ease: Power3.easeOut,
                delay: 0.3
            }, 0.05, callback);
        }

        if (__SERVER__) {
            callback();
        }

    }

    componentWillLeave(callback) {

        if (__CLIENT__) {
            TweenMax.staggerTo(this.cities, 0.5, {
                x: '-100%',
                opacity: 0,
                ease: Power3.easeIn
            }, 0.05, callback);
        }

        if (__SERVER__) {
            callback();
        }

    }

    render() {
        const { isMobile, labels, atelier, windowWidth, windowHeight, onCityClick } = this.props;
        const pattern = [
            {
                x: 7,
                y: 2
            },
            {
                x: 2,
                y: 3
            },
            {
                x: 12,
                y: 4
            },
            {
                x: 6,
                y: 5
            },
            {
                x: 11,
                y: 6
            },
            {
                x: 3,
                y: 7
            }
        ];
        const unitX = Math.round(windowWidth / 16);
        const unitY = Math.round(windowHeight / 9);

        return (
            <div className="o-cities">
                {
                    atelier.map((a, i) => {
                        const itemStyle = {
                            top: `${pattern[i].y * unitY}px`,
                            left: `${(isMobile ? 3 : pattern[i].x) * unitX}px`
                        };
                        return (
                            <a
                                key={i}
                                className="o-cities__link c-link c-link--big"
                                to="#"
                                onClick={onCityClick(a.city).bind(this)}
                                style={itemStyle}>
                                <span className="c-link__value">{ a.city }</span>
                                <span className="c-link__caption">{ labels['view_atelier'] }</span>
                            </a>
                        );
                    })
                }
            </div>
        );
    }
}

Cities.propTypes = {
    atelier: React.PropTypes.array.isRequired,
    windowWidth: React.PropTypes.number.isRequired,
    windowHeight: React.PropTypes.number.isRequired,
    onCityClick: React.PropTypes.func.isRequired
};

export default Cities;

import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

// Utilities
import { changeUrlParameter, Timeout } from '../../utilities/utils';

import {TweenMax, TimelineMax} from 'gsap';
import Waypoint from 'react-waypoint';

import Cell from '../Cell/Cell.jsx';
import ProductThumb from '../Product/ProductThumb.jsx';
import Box from '../Box/Box.jsx';

class SingleCollection extends PureComponent {

    constructor(props) {
        super(props);

        this.currentProducts = props.products.map(p => Object.assign({}, p, {
            thumbSrc: changeUrlParameter(p.imageSrc, 'w', 200),
            isVisible: false
        }));

        this.columns = this.getColumns(props);
    }

    componentDidMount() {
        const { isMobile, collectionOpenY } = this.props;
        const el = findDOMNode(this);

        this.handleBoxEnter();

        if (__CLIENT__) {
            if (isMobile) {
                TweenMax.fromTo(el, 0.7, {
                    y: 0,
                    autoAlpha: 0
                }, {
                    y: 150,
                    autoAlpha: 1,
                    ease: Power2.easeOut
                });
            } else {
                TweenMax.fromTo(el, 0.7, {
                    y: 100,
                    autoAlpha: 0
                }, {
                    y: 0,
                    autoAlpha: 1,
                    ease: Power2.easeOut
                });
            }
        }
    }

    handleProductThumbEnter() {
        const i = arguments[0];

        if (!this.currentProducts[i].isVisible) {
            this.currentProducts[i].isVisible = true;

            const {idProduct, slug} = this.currentProducts[i];
            const containerThumb = document.getElementById(`${idProduct}-${slug}`);
            const thumb          = containerThumb.querySelector('.c-thumb');
            const thumbCover     = containerThumb.querySelector('.c-thumb__cover');
            const thumbThumb     = containerThumb.querySelector('.c-thumb__cover--thumb');
            const thumbReveal    = containerThumb.querySelector('.c-thumb__reveal');

            const done = () => {
                TweenMax.set([thumb, thumbReveal, thumbCover], { clearProps: 'clearAll' });
            };

            const delay = i === 0 ? 0.6 : 0;
            const enterTl = new TimelineMax({ delay: delay, onComplete: done });

            enterTl
                .to(thumbReveal, 1, { scaleY: 1, ease: Expo.easeIn })
                .set(thumbReveal, { transformOrigin: '50% 100%' })
                .set([thumbCover, thumbThumb], { visibility: 'visible' })
                .to(thumbReveal, 0.7, { scaleY: 0, ease: Power3.easeOut })
                .set(thumb, { className: '+=is-visible' })
                .insert(TweenMax.to(thumb, 1, { y: '0%', ease: Power3.easeOut }), 0)
                .insert(TweenMax.to([thumbCover, thumbThumb], 1.2, { y: '0%', ease: Power3.easeOut }), 1);
        }
    }

    handleBoxEnter() {
        const box = document.getElementById('description-box');

        if (box && !box.classList.contains('is-visible')) {

            new Timeout(10)
                .then(() => {
                    const boxReveal     = box.querySelector('.c-box__reveal');
                    const boxCover      = box.querySelector('.c-box__cover');
                    const boxTitle      = box.querySelector('.c-box__inner > h4');
                    const boxInnerLines = Array.from(box.querySelectorAll('.js-desc-line'));
                    const allBoxLines = [boxTitle].concat(boxInnerLines);

                    const done = () => {
                        TweenMax.set([boxReveal, boxCover, box], { clearProps: 'clearAll' });
                    };

                    const enterTl = new TimelineMax({ delay: 0.4, onComplete: done });

                    enterTl
                        .set(box, { className: '+=is-visible' })
                        .to(boxReveal, 1, { scaleY: 1, ease: Expo.easeInOut })
                        .set(boxReveal, { transformOrigin: '50% 100%' })
                        .set(boxCover, { visibility: 'visible' })
                        .to(boxReveal, 0.7, { scaleY: 0, ease: Power3.easeOut })
                        .insert(TweenMax.to(box, 1, { y: '0%', ease: Power3.easeOut }), 0)
                        .insert(TweenMax.to(boxCover, 1.2, { y: '0%', ease: Power3.easeOut }), 1)
                        .insert(TweenMax.staggerTo(allBoxLines, 2, { y: 0, opacity: 1, ease: Expo.easeOut }, 0.07), 1.3);
                });
        }
    }

    getColumns(props) {
        const { href, isMobile, isTablet, onProductClick } = props;
        const leftColumn = [];
        const rightColumn = [];

        let leftCount = 2, // Space for the gray box
            rightCount = 0;

        if (isMobile) {
            this.currentProducts.map((p, i) => {
                const { idProduct, name, slug, imageSrc, thumbSrc, height } = p;
                const cellHeight = height > 1 ? 'o-cell--tall' : '';
                const cell = (
                    <Cell modifier={cellHeight} key={idProduct}>
                        <ProductThumb
                            onProductClick={onProductClick}
                            idProduct={idProduct}
                            name={name}
                            slug={slug}
                            imageSrc={imageSrc}
                            thumbSrc={thumbSrc}
                            to={href}
                            isMobile={isMobile}
                            isTablet={isTablet}
                        />
                    </Cell>
                );
                leftColumn.push(cell);
            });
        } else {
            this.currentProducts.map((p, i) => {
                const { idProduct, name, slug, imageSrc, thumbSrc, height } = p;
                const cellHeight = height > 1 ? 'o-cell--tall' : '';

                const cell = (
                    <Cell modifier={cellHeight} key={idProduct}>
                        { !isMobile && !isTablet &&
                            <Waypoint
                                onEnter={this.handleProductThumbEnter.bind(this, i)}
                            />
                        }
                        <ProductThumb
                            onProductClick={onProductClick}
                            idProduct={idProduct}
                            name={name}
                            slug={slug}
                            imageSrc={imageSrc}
                            thumbSrc={thumbSrc}
                            to={href}
                            isMobile={isMobile}
                            isTablet={isTablet}
                        />
                    </Cell>
                );
                if (rightCount >= leftCount) {
                    leftColumn.push(cell);
                    leftCount = leftCount + height;
                } else {
                    rightColumn.push(cell);
                    rightCount = rightCount + height;
                }
            });
        }

        return [ leftColumn, rightColumn ];
    }

    render() {
        const { intro } = this.props;

        return (
            <div className="c-collections__body">
                <div className="o-container">

                    <div className="o-col o-col--sx u-50@tablet">
                        <div className='o-cell o-cell--tall'>
                            <div className="o-cell__inner">
                                <Box modifier="u-text--center" boxId="description-box">
                                    <h4>{intro.title}</h4>
                                    <p>{intro.text}</p>
                                </Box>
                            </div>
                        </div>
                        {this.columns[0]}
                    </div>

                    <div className="o-col o-col--dx u-50@tablet">
                        {this.columns[1]}
                    </div>

                    <div className="u-clear"></div>
                </div>
            </div>
        );
    }
}

export default SingleCollection;



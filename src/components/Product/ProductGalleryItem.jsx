import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

import { preloadImage } from '../../utilities/utils';

class ProductGalleryItem extends PureComponent {

    componentDidMount() {
        const { imageSmall } = this.props;

        this.el = findDOMNode(this);
        this.cover = this.el.querySelector('.c-gallery__image');
        this.thumb = this.el.querySelector('.c-gallery__image--thumb');

        // Remove thumbs
        const url = imageSmall;
        preloadImage((global.pD || '') + url)
            .then(() => TweenMax.to(this.thumb, 0.5, { opacity: 0 }))
            .catch((reason) => console.warn(reason));
    }

    componentWillEnter(callback) {
        const {setMovingState, unsetMovingState, directionEnter} = this.props;
        setMovingState();

        const done = () => {
            TweenMax.set([this.el, this.cover], { clearProps: 'transform, zIndex' });
            unsetMovingState();
            callback();
        };
        const tl = new TimelineMax({onComplete: done});

        switch (directionEnter) {
        case 'top':
            tl
                .set(this.el, { zIndex: '10'})
                .fromTo(this.el, 1, { y: '-100%' }, { y: '0%', ease: Expo.easeInOut })
                .insert(TweenMax.fromTo([this.cover, this.thumb], 1, {
                    y: '50%'
                }, {
                    y: '0%',
                    ease: Expo.easeInOut
                }), 0);
            break;

        case 'bottom':
            tl
                .set(this.el, { zIndex: '10'})
                .fromTo(this.el, 1, { y: '100%' }, { y: '0%', ease: Expo.easeInOut })
                .insert(TweenMax.fromTo([this.cover, this.thumb], 1, {
                    y: '-50%'
                }, {
                    y: '0%',
                    ease: Expo.easeInOut
                }), 0);
            break;

        default:
            console.warn('no enter animation specified');
        }
    }

    componentWillLeave(callback) {
        const {directionLeave} = this.props;

        switch (directionLeave) {
        case 'top':
            TweenMax.fromTo(this.el, 1, {
                y: '0%'
            }, {
                y: '20%',
                ease: Expo.easeInOut,
                onComplete: callback
            });
            break;

        case 'bottom':
            TweenMax.fromTo(this.el, 1, {
                y: '0%'
            }, {
                y: '-20%',
                ease: Expo.easeInOut,
                onComplete: callback
            });
            break;

        default:
            console.warn('no leave animation specified');
        }
    }

    render() {
        const {imageSmall, imageThumb} = this.props;

        const imageStyle = {
            backgroundImage: `url(${global.pD || ''}${imageSmall})`
        };

        const thumbStyle = {
            backgroundImage: `url(${global.pD || ''}${imageThumb})`
        };

        return (
            <div className="c-gallery__item">
                <div className="c-gallery__image" style={imageStyle}></div>
                <div className="c-gallery__image c-gallery__image--thumb" style={thumbStyle}></div>
            </div>
        );
    }
}

export default ProductGalleryItem;



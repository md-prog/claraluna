import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { Link, browserHistory } from 'react-router';
import { findDOMNode } from 'react-dom';

// Utilities
import { bindFunctions, preloadImage } from '../../utilities/utils';

class ProductThumb extends PureComponent {

    constructor(props) {
        super(props);
        bindFunctions.call(this, ['handleProductClick']);
    }

    componentDidMount() {
        const {isMobile, isTablet, imageSrc} = this.props;
        this.el = findDOMNode(this);
        this.reveal = this.el.querySelector('.c-thumb__reveal');
        this.thumb = this.el.querySelector('.c-thumb');
        this.cover = this.el.querySelector('.c-thumb__cover');
        this.coverThumb = this.el.querySelector('.c-thumb__cover--thumb');

        if (!isMobile && !isTablet) {
            TweenMax.set(this.thumb, { y: '30%' });
            TweenMax.set([this.cover, this.coverThumb], { y: '-10%', visibility: 'hidden' });

            // Image loaded, fade out the thumb
            preloadImage((global.pD || '') + imageSrc)
                .then(() => TweenMax.to(this.coverThumb, 0.5, { opacity: 0 }));
        } else {
            TweenMax.fromTo(this.thumb, 0.7, {
                autoAlpha: 0,
                y: 100
            }, {
                autoAlpha: 1,
                y: 0,
                delay: 1.3
            });
        }
    }

    handleProductClick(event) {
        const { to, slug, onProductClick } = this.props;
        onProductClick.call(this, event, `${to}/${slug}`);
    }

    render() {
        const { imageSrc, thumbSrc, name, idProduct, slug, isMobile, to } = this.props;

        const imageStyle = {
            backgroundImage: isMobile ? '' : `url(${global.pD || ''}${imageSrc})`
        };

        const thumbStyle = {
            backgroundImage: isMobile ? '' : `url(${global.pD || ''}${thumbSrc})`
        };

        return (
            <Link to={to} onClick={this.handleProductClick} id={`${idProduct}-${slug}`}>
                <div className="c-thumb">
                    <div className="c-thumb__reveal"></div>
                    <div className="c-thumb__cover" style={imageStyle}></div>
                    <div className="c-thumb__cover c-thumb__cover--thumb" style={thumbStyle}></div>
                    <div className="c-thumb__caption">{name}</div>
                    <div className="c-thumb__icon"><i className="o-ico o-ico--eye"></i></div>
                    { isMobile && <img src={(global.pD || '') + imageSrc} alt={name} /> }
                </div>
            </Link>
        );
    }
}

export default ProductThumb;



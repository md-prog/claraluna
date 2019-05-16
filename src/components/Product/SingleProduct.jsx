import React from 'react';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';

// Utilities
import { bindFunctions, Timeout } from '../../utilities/utils';

// Components
import ProductGallery from './ProductGallery.jsx';
import BackgroundImage from '../BackgroundImage/BackgroundImage.jsx';
import Heart from '../Wishlist/Heart.jsx';
import ShareButtons from '../Share/ShareButtons.jsx';

class SingleProduct extends PureComponent {

    constructor(props) {
        super(props);
        bindFunctions.call(this, ['toggleShareButtons', 'toggleReadMore']);

        this.state = {
            shareState: 0,
            showReadMoreButton: false,
            readMore: false
        };
    }

    componentDidMount() {
        const { direction, appState } = this.props;

        this.el                   = findDOMNode(this);
        this.prodTitle            = this.el.querySelector('.c-product__name');
        this.prodDescription      = this.el.querySelector('.c-product__description');
        this.prodJSDescription    = this.el.querySelector('.js-description');
        this.prodCategory         = this.el.querySelector('.c-product__category');
        this.prodTools            = this.el.querySelector('.c-product__tools');
        this.prodGalleryIndicator = this.el.querySelectorAll('.c-gallery__indicator');
        this.prodGalleryReveal    = this.el.querySelector('.c-gallery__reveal');
        this.prodGallerySlides    = this.el.querySelector('.c-gallery__slides');
        this.prodGalleryItem      = this.el.querySelector('.c-gallery__item');
        this.counter              = document.body.querySelector('.c-counter__current');

        if (direction === 'left' || direction === 'right') {
            this.enterAnimationBetweenProducts(direction);
        } else {
            this.enterAnimation();
        }

        // Read More
        this.descriptionHeight = this.prodJSDescription.clientHeight;
        this.closeHeight = appState.isMobile ? 65 : 90;
        TweenMax.set(this.prodJSDescription, { height: this.closeHeight, overflow: 'hidden' });

        if (!this.props.appState.isMobile) {
            new Timeout(100)
                .then(() => {
                    const titleHeight = this.prodTitle.clientHeight;
                    TweenMax.set(this.prodTitle, { height: titleHeight });
                });
        }

        if (this.descriptionHeight > this.closeHeight) {
            this.setState({
                showReadMoreButton: true
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {

        if (nextState.readMore !== this.state.readMore) {
            if (nextState.readMore) {
                const toolTop = this.prodTools.getBoundingClientRect().top;
                const titleTop = this.prodTitle.getBoundingClientRect().top;
                const tl = new TimelineMax();

                tl
                    .to(this.prodTitle, 1.5, {
                        y: (titleTop - toolTop) * -1,
                        ease: Expo.easeInOut
                    })
                    .insert(TweenMax.to(this.prodTools, 0.3, {
                        opacity: 0
                    }), 0)
                    .insert(TweenMax.to(this.prodJSDescription, 1.5, {
                        height: this.descriptionHeight,
                        overflow: 'hidden',
                        ease: Expo.easeInOut
                    }), 0)
                    .insert(TweenMax.to(this.prodDescription, 1.5, {
                        y: (titleTop - toolTop) * -1,
                        delay: 0.1,
                        ease: Expo.easeInOut
                    }), 0);
            } else {
                const done = () => {
                    TweenMax.set([
                        this.prodTitle,
                        this.prodTools,
                        this.prodDescription
                    ], {
                        clearProps: 'transform, opacity'
                    });
                };
                const tl = new TimelineMax({onComplete: done});
                tl
                    .to(this.prodTitle, 0.7, {
                        y: 0,
                        delay: 0.1
                    })
                    .insert(TweenMax.to(this.prodTools, 0.3, {
                        opacity: 1
                    }), 0.7)
                    .insert(TweenMax.to(this.prodJSDescription, 0.7, {
                        height: this.closeHeight,
                        overflow: 'hidden'
                    }), 0)
                    .insert(TweenMax.to(this.prodDescription, 0.7, {
                        y: 0
                    }), 0);
            }
        }
    }

    componentWillUnmount() {
        TweenMax.killTweensOf([
            this.prodTitle,
            this.prodDescription,
            this.prodGalleryReveal,
            this.prodGallerySlides
        ]);
        if (this.prodGalleryIndicator.length > 0) {
            TweenMax.killTweensOf(this.prodGalleryIndicator);
        }
    }

    enterAnimation() {
        const { onLoad } = this.props;

        const done = () => {
            onLoad();
            if (__CLIENT__) {
                TweenMax.set([
                    this.prodTitle,
                    this.prodDescription,
                    this.prodGalleryReveal,
                    this.prodGallerySlides
                ], { clearProps: 'transform, opacity, transformOrigin, visibility' });

                if (this.prodGalleryIndicator.length > 0) {
                    TweenMax.set(this.prodGalleryIndicator, { clearProps: 'all' });
                }
            }
        };

        const tl = new TimelineMax({ onComplete: done });

        tl
            .set(this.prodGallerySlides, { visibility: 'hidden' })
            .set(this.prodGalleryReveal, { transformOrigin: '50% 0%', scaleX: 1, scaleY: 0 })
            .to(this.prodGalleryReveal, 1, { scaleY: 1, ease: Expo.easeIn })
            .set(this.prodGalleryReveal, { transformOrigin: '50% 100%' })
            .set(this.prodGallerySlides, { visibility: 'visible' })
            .to(this.prodGalleryReveal, 0.7, { scaleY: 0, ease: Power3.easeOut });

        if (this.prodGalleryIndicator.length > 0) {
            TweenMax.staggerFromTo(this.prodGalleryIndicator, 0.5, { x: '50%', opacity: 0 }, { x: '0%', opacity: 1, delay: 1 }, 0.2);
        }

        TweenMax.staggerFromTo([
            this.prodTitle,
            this.prodDescription,
            this.prodCategory,
            this.prodTools
        ], 1, { opacity: 0 }, { opacity: 1, delay: 1, ease: Power3.easeOut }, 0.2);
    }

    enterAnimationBetweenProducts(direction) {

        const { onLoad } = this.props;

        const done = () => {
            onLoad();
            TweenMax.set([
                this.prodTitle,
                this.prodDescription,
                this.prodGalleryReveal,
                this.prodGallerySlides
            ], { clearProps: 'transform, opacity, transformOrigin, visibility' });
        };

        if (this.prodGalleryIndicator.length > 0) {
            TweenMax.staggerFromTo(this.prodGalleryIndicator, 0.4,
                { x: '-50%', opacity: 0 },
                { x: '0%', opacity: 1, delay: 1, ease: Power3.easeOut }, 0.1);
        }

        if (direction === 'left') {

            TweenMax.staggerFromTo([this.prodTitle, this.prodDescription], 1,
                { x: '5%', opacity: 0 },
                { x: '0%', opacity: 1, ease: Power3.easeOut }, 0.1);

            TweenMax.fromTo(this.counter, 0.5, { x: '80%', opacity: 0 }, { x: '0%', opacity: 1, ease: Power3.easeOut });

            const tl = new TimelineMax({ onComplete: done });

            if (this.prodGalleryItem) {
                tl
                    .set(this.prodGalleryItem, { x: '100%' })
                    .to(this.prodGalleryItem, 1, { x: '0%', ease: Expo.easeInOut });
            } else {
                new Timeout(1000)
                    .then(() => done());
            }
        }

        if (direction === 'right') {
            TweenMax.staggerFromTo([this.prodTitle, this.prodDescription], 1,
                { x: '-5%', opacity: 0 },
                { x: '0%', opacity: 1, ease: Power3.easeOut }, 0.1);

            TweenMax.fromTo(this.counter, 0.5, { x: '-80%', opacity: 0 }, { x: '0%', opacity: 1, ease: Power3.easeOut });

            const tl = new TimelineMax({ onComplete: done });

            if (this.prodGalleryItem) {
                tl
                    .set(this.prodGalleryItem, { x: '-100%' })
                    .to(this.prodGalleryItem, 1, { x: '0%', ease: Expo.easeInOut });
            } else {
                new Timeout(1000)
                    .then(() => done());
            }
        }
    }

    render() {
        const {
            labels,
            href,
            categoryName,
            appState,
            wishlist,
            isDetailOpen,
            product,
            collection,
            gallery,
            direction,
            setCurrentSlide,
            setIsZoomActive,
            unsetIsZoomActive,
            setMovingState,
            unsetMovingState,
            setFrameVisible,
            unsetFrameVisible,
            wishlistToggle,
            openZoom,
            closeZoom
        } = this.props;

        const collectionCoverStyle = {
            transform: 'translateY(30%)',
            backgroundImage: `url(${global.pD || ''}${collection.imageSrc})`
        };

        const inWishlist = wishlist.indexOf(product.idProduct) > -1;

        return (
            <div className="c-collections__item">
                <BackgroundImage src={`${global.pD || ''}${collection.imageSrc}`} />

                <div className="c-collections__head">
                    <div className="c-collections__cover" style={collectionCoverStyle}></div>
                </div>

                <div className="c-product">
                    <div className={`c-product__container c-product__container--left ${isDetailOpen ? 'is-detail-open' : ''}`}>
                        <div className="c-product__inner">
                            <div className="c-product__details">
                                <h2 className="c-product__category u-text--geometric">{collection.name}</h2>
                                <ul className="c-product__tools">
                                    <li>
                                        <Heart
                                            shareState={this.state.shareState}
                                            clickCallback={wishlistToggle(product.idProduct, product.name).bind(this)}
                                            inWishlist={inWishlist}
                                        />
                                    </li>
                                    <li>
                                        <ShareButtons
                                            categoryName={categoryName}
                                            productName={product.name}
                                            appState={appState}
                                            shareState={this.state.shareState}
                                            toggleShareButtons={this.toggleShareButtons}
                                            href={href}
                                        />
                                    </li>
                                </ul>
                                <h1 className="c-product__name">{product.name}</h1>
                                <div className="c-product__description">
                                    <p className="u-text--title">{labels['details']}</p>
                                    <p className="js-description" dangerouslySetInnerHTML={ {__html: product.description} } />

                                    {
                                        this.state.showReadMoreButton &&
                                            <button className="c-btn--read-more" type="button" onClick={this.toggleReadMore}>
                                                { this.state.readMore ? labels['close'] : labels['read_more'] }
                                            </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="c-product__container c-product__container--right">
                        <div className="c-product__inner">
                            <div className="c-product__gallery">
                                <ProductGallery
                                    appState={{...appState}}
                                    idGallery={product.idGallery}
                                    gallery={gallery}
                                    direction={direction}
                                    setCurrentSlide={setCurrentSlide}
                                    setIsZoomActive={setIsZoomActive}
                                    unsetIsZoomActive={unsetIsZoomActive}
                                    setMovingState={setMovingState}
                                    unsetMovingState={unsetMovingState}
                                    setFrameVisible={setFrameVisible}
                                    unsetFrameVisible={unsetFrameVisible}
                                    openZoom={openZoom}
                                    closeZoom={closeZoom}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    toggleReadMore(event) {
        event.preventDefault();

        if (this.state.readMore === false) {
            this.setState({
                readMore: true
            });
        } else {
            this.setState({
                readMore: false
            });
        }
    }

    toggleShareButtons(event) {
        event.preventDefault();

        if (this.state.shareState === 0) {
            this.setState({
                shareState: 1
            });
        } else {
            this.setState({
                shareState: 0
            });
        }
    }
}

export default SingleProduct;



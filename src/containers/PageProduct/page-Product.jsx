import React from 'react';
import { bindActionCreators } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-transition-group';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Utilities
import { bindFunctions, setCookie, testCookie, arrayEqual, preloadImage, getLabels } from '../../utilities/utils';
import {
    getCategoryIdFromSlug,
    getCollectionIdFromSlug,
    getProductIdFromSlug,
    getCollectionByIdCollection,
    getProductsByIdCollection,
    getProductByIdProduct,
    getGallery
} from '../../utilities/collections';
import { getPage } from '../../utilities/pages';

// Actions
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { setIsZoomActive, unsetIsZoomActive } from '../../components/Zoom/actions-zoom';
import { setFrameVisible, unsetFrameVisible } from '../../components/Frame/actions-frame';
import { setActiveCategory } from '../PageHome/actions-categories';
import { setActiveCollection } from '../PageCollections/actions-collection';
import { setActiveProduct, setCurrentSlide } from './actions-product';
import { showReservedAreaLink, hideReservedAreaLink } from '../../components/Frame/actions-reserved-area';
import { frameButtonBookAnAppointment, hideFrameButton, frameButtonStoreLocator } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo, hideLogo } from '../../components/Logo/actions-logo';
import { showVatNumber, hideVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn, hideViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger, hideMenuTrigger } from '../../components/Menu/actions-menu';
import { addWishItem, removeWishItem } from '../PageWishlist/actions-wishlist';
import * as appActionCreators from '../App/actions-app';

// Components
import PageContainer from '../PageContainer.jsx';
import Helmet from 'react-helmet';
import ProductsNavi from '../../components/Product/ProductsNavi.jsx';
import SingleProduct from '../../components/Product/SingleProduct.jsx';

export class Product extends PageContainer {

    constructor(props) {
        super(props);

        const { app, products, pages, labels, params, location } = props;

        bindFunctions.call(this, [
            'onViewAllClick',
            'onPrevClick',
            'onNextClick',
            'onDetailOpen',
            'onWishlistToggle',
            'onSingleProductLoad',
            'openZoom',
            'closeZoom'
        ]);

        this.seoParams = this.getSeoParams('products', products.find(c => c.slug === params.slugProduct));

        this.labels = getLabels(labels, [
            'details',
            'read_more',
            'close'
        ]);

        this.direction = null;
        this.state = {
            cookieTest: __CLIENT__ && testCookie(),
            isDetailOpen: false
        };

        // CACHING objects
        // Collections Page
        this.collectionsPage = getPage(pages, 'collections');
        // activeCategory
        this.activeCategory = (app.activeCategory === null)
            ? getCategoryIdFromSlug(props.categories, params.slugCategory)
            : app.activeCategory;
        // activeCollection
        this.activeCollection = (app.activeCollection === null)
            ? getCollectionIdFromSlug(props.collections, params.slugCollection)
            : app.activeCollection;
        // activeProduct
        this.activeProduct = (app.activeProduct === null)
            ? getProductIdFromSlug(products, params.slugProduct)
            : app.activeProduct;
        // Product of this specific collection
        this.productsOfCollection = getProductsByIdCollection(products, this.activeCollection);
        this.productIndex = this.getProductCounter(this.productsOfCollection, this.activeProduct);
        const intProductIndex = Number.parseInt(this.productIndex, 10) - 1; // this.productIndex parte da 1
        this.nextIndex = this.productsOfCollection[intProductIndex + 1] ? intProductIndex + 1 : 0;
        this.prevIndex = intProductIndex === 0 ? this.productsOfCollection.length - 1 : intProductIndex - 1;

        this.productAmount = this.productsOfCollection.length < 10 ? '0' + this.productsOfCollection.length.toString() : this.productsOfCollection.length.toString();
        // Build the complete object of the current product
        const product = getProductByIdProduct(products, this.activeProduct);
        this.currentProduct = Object.assign({}, product, {
            gallery: getGallery(props.galleries, product.idGallery),
            collection: getCollectionByIdCollection(props.collections, this.activeCollection)
        });
        // Product first pic
        this.productImage = global.pD + (this.currentProduct.gallery.pics[0] ? this.currentProduct.gallery.pics[0].big : DEFAULT_IMG);
        this.appState = this.getAppStateObject(app);

        // this href
        const hostname = __CLIENT__ ? global.location.origin : '';
        this.href = hostname + location.pathname;

        // Images preload
        this.preloadImages(this.currentProduct.gallery.pics);

        const nextGallery = getGallery(props.galleries, this.productsOfCollection[this.nextIndex].idGallery).pics;
        const prevGallery = getGallery(props.galleries, this.productsOfCollection[this.prevIndex].idGallery).pics;
        this.preloadImages(prevGallery);
        this.preloadImages(nextGallery);
    }

    /**
     * Get an array of gallery
     * Return an array of promises
     * @param images
     * @returns {Promise}
     */
    preloadImages(pics) {
        return Promise.all(pics.map(pic => preloadImage(global.pD + pic.small)));
    }

    // Render methods should be a pure function of props and state;
    // constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.
    componentWillMount() {
        super.componentWillMount();

        const { app, categories, frameActionCreators, dispatch } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        const actions = [];
        // -------------------------------------
        // Dispatch first actions (if necessary)
        // -------------------------------------
        // Update activeCategory
        if (app.activeCategory !== this.activeCategory) {
            actions.push(setActiveCategory(this.activeCategory));
        }
        // Update activeCollection
        if (app.activeCollection !== this.activeCollection) {
            actions.push(setActiveCollection(this.activeCollection));
        }
        // Update activeProduct
        if (app.activeProduct !== this.activeProduct) {
            actions.push(setActiveProduct(this.activeProduct));
        }

        if (actions.length > 0) {
            dispatch(batchActions(actions));
        }

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        const currentCategoryIndex = categories.findIndex(c => c.idCategory === this.activeCategory);
        const buttonStateAction = (currentCategoryIndex === 0) ? { frameButtonBookAnAppointment } : { frameButtonStoreLocator };
        this.afterLoaderActions = Object.assign({}, this.afterLoaderActions, buttonStateAction);

        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);
            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    componentDidMount() {
        const { app } = this.props;

        this.getDOMReferences();

        TweenMax.set(this.collectionHead, { y: app.windowHeight * -1 });
    }

    componentWillUpdate(nextProps) {
        const {app, collections, products, galleries, wishlist, dispatch, params, location} = nextProps;
        // If App loader just gone...
        if (app.isAppLoading !== this.props.app.isAppLoading) {
            this.dispatchActions(app, this.afterLoaderActions, dispatch);
        }

        if (params.slugProduct !== this.props.params.slugProduct) {
            // activeProduct Update
            this.activeProduct = getProductIdFromSlug(products, params.slugProduct);
            // currentProduct Update
            const product = getProductByIdProduct(products, this.activeProduct);
            this.productIndex = this.getProductCounter(this.productsOfCollection, this.activeProduct);
            const intProductIndex = Number.parseInt(this.productIndex, 10) - 1;
            this.nextIndex = this.productsOfCollection[intProductIndex + 1] ? intProductIndex + 1 : 0;
            this.prevIndex = intProductIndex === 0 ? this.productsOfCollection.length - 1 : intProductIndex - 1;

            this.currentProduct = Object.assign({}, product, {
                gallery: getGallery(galleries, product.idGallery),
                collection: getCollectionByIdCollection(collections, this.activeCollection)
            });
            const hostname = __CLIENT__ ? global.location.origin : '';
            this.href = hostname + location.pathname;
            dispatch(setActiveProduct(this.activeProduct));

            // Preload next product images
            this.preloadImages(this.currentProduct.gallery.pics);
            const nextGallery = getGallery(galleries, this.productsOfCollection[this.nextIndex].idGallery).pics;
            const prevGallery = getGallery(galleries, this.productsOfCollection[this.prevIndex].idGallery).pics;
            this.preloadImages(prevGallery);
            this.preloadImages(nextGallery);
        }

        // Update cookie wishlist
        if (!arrayEqual(wishlist, this.props.wishlist)) {
            setCookie('claraluna_wishlist', wishlist.toString(), 60);
        }

        // Update this.appState
        // Updating the thi.appState object
        if ( app.isZoomActive !== this.appState.isZoomActive
            || app.isMobile !== this.appState.isMobile
            || app.isMoving !== this.appState.isMoving
            || app.windowHeight !== this.appState.windowHeight
            || app.windowWidth !== this.appState.windowWidth
        ) {
            this.appState = this.getAppStateObject(app);
        }
    }

    getProductCounter(products, activeProduct) {
        try {
            const productCounter = products.findIndex(p => p.idProduct === activeProduct) + 1;
            return productCounter < 10 ? '0' + productCounter.toString() : productCounter.toString();
        } catch (err) {
            return '00';
        }
    }

    componentDidUpdate(prevProps) {
        const { app } = this.props;
        const { params } =  prevProps;

        this.getDOMReferences();

        if (params.slugProduct !== this.props.params.slugProduct || prevProps.app.windowHeight !== this.props.app.windowHeight) {
            TweenMax.set(this.collectionHead, { y: app.windowHeight * -1 });
        }
    }

    getAppStateObject(app) {
        return {
            isMoving: app.isMoving,
            isMobile: app.isMobile,
            isZoomActive: app.isZoomActive,
            windowHeight: app.windowHeight,
            windowWidth: app.windowWidth
        };
    }

    onViewAllClick() {
        const { app, params } = this.props;
        const { isMoving, isMobile } = app;
        const { slugCategory, slugCollection } = params;
        const href = `${this.urlLangSuffix}/${this.collectionsPage.title}/${slugCategory}/${slugCollection}`;

        const go = () => {
            this.viewAllTransition()
                .then(() => browserHistory.push(href))
                .catch((reason) => console.warn(reason));
        };

        if (!isMoving) {

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': slugCategory,
                    'eventAction': this.currentProduct.name,
                    'eventLabel': 'esci'
                });
            }

            if (isMobile && this.state.isDetailOpen) {
                this.setState({
                    isDetailOpen: !this.state.isDetailOpen
                }, () => go());
            } else {
                go();
            }
        }

    }

    onPrevClick() {
        const { app, params } = this.props;
        const { isMoving } = app;
        const { slugCategory, slugCollection } = params;

        const prevProdSlug = this.productsOfCollection[this.prevIndex].slug;
        const href = `${this.urlLangSuffix}/${this.collectionsPage.title}/${slugCategory}/${slugCollection}/${prevProdSlug}`;

        if (!isMoving) {

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': slugCategory,
                    'eventAction': prevProdSlug,
                    'eventLabel': 'prev'
                });
            }

            this.prevClickTransition()
                .then(() => browserHistory.push(href))
                .catch((reason) => console.warn(reason));
        }
    }

    onNextClick() {
        const { app, params } = this.props;
        const { isMoving } = app;
        const { slugCategory, slugCollection } = params;

        const nextProdSlug = this.productsOfCollection[this.nextIndex].slug;

        const href = `${this.urlLangSuffix}/${this.collectionsPage.title}/${slugCategory}/${slugCollection}/${nextProdSlug}`;

        if (!isMoving) {

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': slugCategory,
                    'eventAction': nextProdSlug,
                    'eventLabel': 'next'
                });
            }

            this.nextClickTransition()
                .then(() => browserHistory.push(href))
                .catch((reason) => console.warn(reason));
        }
    }

    nextClickTransition() {
        return new Promise(resolve => {
            const { boundActionCreators } = this.props;
            const { setMovingState } = boundActionCreators;
            const tl = new TimelineMax({ onComplete: resolve });

            setMovingState();

            this.direction = 'left';

            tl
                .set(this.prodGalleryReveal, { transformOrigin: '100% 50%', scaleX: 0, scaleY: 1 })
                .to(this.prodGalleryReveal, 0.7, { scaleX: 1, scaleY: 1, ease: Expo.easeIn })
                .set(this.prodGalleryReveal, { transformOrigin: '0% 50%'})
                .set(this.prodGallerySlides, { visibility: 'hidden'})
                .to(this.prodGalleryReveal, 0.7, { scaleX: 0, ease: Expo.easeOut });

            if (this.prodGalleryIndicator.length > 0) {
                TweenMax.staggerTo(this.prodGalleryIndicator, 0.4, { x: '50%', opacity: 0 }, 0.1);
            }
            TweenMax.staggerTo([this.prodTitle, this.prodDescription], 1.4, { x: '-5%', opacity: 0, ease: Power3.easeIn }, 0.1);
            TweenMax.to(this.counter, 0.5, { x: '-80%', opacity: 0, ease: Power3.easeIn, delay: 0.5 });
        });
    }

    prevClickTransition() {
        return new Promise((resolve) => {
            const { boundActionCreators } = this.props;
            const { setMovingState } = boundActionCreators;
            const tl = new TimelineMax({ onComplete: resolve });

            setMovingState();

            this.direction = 'right';

            tl
                .set(this.prodGalleryReveal, { transformOrigin: '0% 50%', scaleX: 0, scaleY: 1 })
                .to(this.prodGalleryReveal, 0.5, { scaleX: 1, scaleY: 1, ease: Expo.easeIn })
                .set(this.prodGalleryReveal, { transformOrigin: '100% 50%'})
                .set(this.prodGallerySlides, { visibility: 'hidden'})
                .to(this.prodGalleryReveal, 0.5, { scaleX: 0, ease: Expo.easeOut });

            if (this.prodGalleryIndicator.length > 0) {
                TweenMax.staggerTo(this.prodGalleryIndicator, 0.4, { x: '50%', opacity: 0 }, 0.1);
            }
            TweenMax.staggerTo([this.prodTitle, this.prodDescription], 0.7, { x: '5%', opacity: 0, ease: Power3.easeIn }, 0.1);
            TweenMax.to(this.counter, 0.5, { x: '80%', opacity: 0, ease: Power3.easeIn, delay: 0.5 });
        });
    }

    viewAllTransition() {
        return new Promise((resolve) => {
            const { boundActionCreators, app } = this.props;
            const { setMovingState } = boundActionCreators;
            const { isMobile, collectionOpenY } = app;
            const tl = new TimelineMax({ onComplete: resolve });

            setMovingState();

            tl
                .set(this.prodGalleryReveal, { transformOrigin: '50% 100%', scaleX: 1, scaleY: 0 })
                .to(this.prodGalleryReveal, 1, { scaleX: 1, scaleY: 1, ease: Expo.easeIn })
                .set(this.prodGalleryReveal, { transformOrigin: '50% 0%'})
                .set(this.prodGallerySlides, { visibility: 'hidden'})
                .to(this.prodGalleryReveal, 0.7, { scaleX: 1, scaleY: 0, ease: Power3.easeOut });

            if (!isMobile) {
                TweenMax.to(this.collectionHead, 0.4, { y: collectionOpenY, delay: 1.3 });
                TweenMax.to(this.circleLabel, 0.3, { opacity: 0 });
                TweenMax.staggerTo(Array.from(this.circles).concat(this.counter), 0.5, { y: '-50%', opacity: 0 }, 0.1);
                TweenMax.staggerTo(this.prodGalleryIndicator, 0.4, { x: '50%', opacity: 0 }, 0.1);
                TweenMax.staggerTo([this.prodTitle, this.prodDescription, this.prodCategory, this.prodTools], 0.7, { opacity: 0, ease: Power3.easeIn }, 0.1);
            }
        });
    }

    onDetailOpen() {
        this.setState({
            isDetailOpen: !this.state.isDetailOpen
        });
    }

    onWishlistToggle(idProduct, name) {
        const { wishlist, params, dispatch } = this.props;

        return event => {
            event.preventDefault();
            // Check the presence
            if (wishlist.indexOf(idProduct) > -1) {
                dispatch(removeWishItem(idProduct));
            } else {

                //
                // Analytics
                if (__CLIENT__) {
                    window.dataLayer.push({
                        'event': 'GAevent',
                        'eventCategory': params.slugCategory,
                        'eventAction': name,
                        'eventLabel': 'love'
                    });
                }

                dispatch(addWishItem(idProduct));
            }
        };
    }

    onSingleProductLoad() {
        const { app, boundActionCreators } = this.props;
        const { unsetMovingState } = boundActionCreators;
        if (app.isMoving) {
            unsetMovingState();
        }
    }

    openZoom() {

        const { app, zoomActionCreators, dispatch } = this.props;
        const { isMobile } = app;
        const { hideMenuTrigger, hideLogo, hideVatNumber, hideViewAllCollectionBtn, hideFrameButton, hideReservedAreaLink } = zoomActionCreators;

        if (! isMobile) {
            dispatch(batchActions([
                hideMenuTrigger(),
                hideLogo(),
                hideVatNumber(),
                hideViewAllCollectionBtn(),
                hideFrameButton(),
                hideReservedAreaLink(),
                setIsZoomActive()
            ]));
        }
    }

    closeZoom() {
        const { app, zoomActionCreators, dispatch } = this.props;
        const { isMobile } = app;
        const { showMenuTrigger, showLogo, showVatNumber, showViewAllCollectionBtn, frameButtonBookAnAppointment, showReservedAreaLink } = zoomActionCreators;

        if (! isMobile) {
            dispatch(batchActions([
                showMenuTrigger(),
                showLogo(),
                showVatNumber(),
                showViewAllCollectionBtn(),
                frameButtonBookAnAppointment(),
                showReservedAreaLink(),
                unsetIsZoomActive()
            ]));
        }
    }

    render() {
        const { app, wishlist, boundActionCreators, params } = this.props;
        const { isMoving, isMobile, windowHeight } = app;

        const containerStyle = {
            minHeight: windowHeight
        };

        return (
            <div className="c-collections">
                <div className="c-collections__container" style={containerStyle} key="collection-container">
                    <SingleProduct
                        key={this.currentProduct.idProduct}
                        labels={this.labels}
                        href={this.href}
                        appState={this.appState}
                        cookieTest={this.state.cookieTest}
                        isDetailOpen={this.state.isDetailOpen}
                        categoryName={params.slugCategory}
                        collection={this.currentProduct.collection}
                        wishlist={wishlist}
                        product={this.currentProduct}
                        gallery={this.currentProduct.gallery}
                        direction={this.direction}
                        wishlistToggle={this.onWishlistToggle}
                        onLoad={this.onSingleProductLoad}
                        openZoom={this.openZoom}
                        closeZoom={this.closeZoom}
                        {...boundActionCreators}
                    />
                </div>

                <ProductsNavi
                    onViewAllClick={this.onViewAllClick}
                    onPrevClick={this.onPrevClick}
                    onNextClick={this.onNextClick}
                    onDetailOpen={this.onDetailOpen}
                    isMobile={isMobile}
                    isMoving={isMoving}
                    isDetailOpen={this.state.isDetailOpen}
                    counterCurrent={this.productIndex}
                    counterAmount={this.productAmount}
                />

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:site_name', 'content': 'Claraluna.it'},
                        {'property': 'og:image', 'content': this.productImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }

    getDOMReferences() {
        this.el = findDOMNode(this);
        this.prodTitle = this.el.querySelector('.c-product__name');
        this.prodDescription = this.el.querySelector('.c-product__description');
        this.prodGalleryIndicator = this.el.querySelectorAll('.c-gallery__indicator');
        this.prodGalleryReveal = this.el.querySelector('.c-gallery__reveal');
        this.prodGallerySlides = this.el.querySelector('.c-gallery__slides');
        this.counter = this.el.querySelector('.c-counter__current');
        // View all transition
        this.circles = this.el.querySelectorAll('.c-circle');
        this.circleLabel = this.el.querySelector('.c-circle-wrapper__label');
        this.collectionHead = this.el.querySelector('.c-collections__head');
        this.prodCategory = this.el.querySelector('.c-product__category');
        this.prodTools = this.el.querySelector('.c-product__tools');
    }
}

const mapDispatchToProps = dispatch => ({
    dispatch,
    boundActionCreators: bindActionCreators({
        setMovingState: appActionCreators.setMovingState,
        unsetMovingState: appActionCreators.unsetMovingState,
        setFrameVisible,
        unsetFrameVisible,
        setCurrentSlide
    }, dispatch),
    zoomActionCreators: {
        showMenuTrigger,
        hideMenuTrigger,
        showReservedAreaLink,
        hideReservedAreaLink,
        showVatNumber,
        hideVatNumber,
        showViewAllCollectionBtn,
        hideViewAllCollectionBtn,
        showLogo,
        hideLogo,
        frameButtonBookAnAppointment,
        hideFrameButton
    },
    frameActionCreators: {
        showMenuTrigger,
        showVatNumber,
        showViewAllCollectionBtn,
        showLogo,
        showReservedAreaLink,
        frameButtonBookAnAppointment
    }
});

const mapStateToProps = state => ({
    app: state.app,
    categories: state.categories,
    collections: state.collections,
    products: state.products,
    pages: state.pages,
    galleries: state.galleries,
    wishlist: state.wishlist,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);


/** WEBPACK FOOTER **
 ** ./containers/PageProduct/page-Product.jsx
 **/
import React from 'react';
import PageContainer from '../PageContainer.jsx';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { browserHistory } from 'react-router';
import TransitionGroup from 'react-addons-transition-group';
import { findDOMNode } from 'react-dom';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Utilities
import { bindFunctions, throttle, preloadImage, changeUrlParameter, Timeout, getLabels, getCookie } from '../../utilities/utils';
import { getPage } from '../../utilities/pages';
import {
    getCategoryIdFromSlug,
    getCollectionsByIdCategory,
    getFirstCollectionOfCategory,
    getCollectionByIdCollection,
    getProductsByIdCollection,
    getCollectionIdFromSlug,
    getProductsFromIdArray
} from '../../utilities/collections';
import { validation, sendData } from '../../utilities/bookAnAppointment';

// Action creators
import { setActiveCollection, unsetIsCollectionOpen, setIsCollectionOpen } from './actions-collection';
import { setActiveCategory } from '../PageHome/actions-categories';
import { unsetActiveProduct } from '../PageProduct/actions-product';
import { frameButtonBookAnAppointment, frameButtonStoreLocator } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import * as appActionCreators from '../App/actions-app';
import * as productActionCreators from '../PageProduct/actions-product';
import * as frameButtonActionCreators from '../../components/FrameButton/actions-frameButtonState';

// Components
import { TweenMax, TimelineMax, Expo } from 'gsap';
import Helmet from 'react-helmet';
import CollectionMobileActions from '../../components/Collections/CollectionMobileActions.jsx';
import CollectionItem from '../../components/Collections/CollectionItem.jsx';
import CollectionsProgress from '../../components/Collections/CollectionProgress.jsx';
import CollectionsNavi from '../../components/Collections/CollectionsNavi.jsx';

class Collections extends PageContainer {

    constructor(props) {
        super(props);

        const { app, collections, products } = props;
        const { isCollectionOpen } = app;

        bindFunctions.call(this, [
            'scrollHandler',
            'headAnimations',
            'keyboardHandler',
            'clickNext',
            'clickPrev',
            'clickCollection',
            'wheelCollection',
            'onBackClick',
            'onProductClick',
            'openBookAnAppointmentOverlay',
            'onMouseEnterTheCover',
            'onMouseLeaveTheCover',
            'sendBookAnAppointmentForm'
        ]);

        this.seoParams = this.getSeoParams('categories', props.categories.find(c => c.slug === props.params.slugCategory));

        this.labels = getLabels(props.labels, ['back_to_collections']);

        this.state = {
            direction: null,
            yPosition: __CLIENT__ ? window.pageYOffset || document.documentElement.scrollTop : 0,
            isHeadHidden: false,
            canWheelCloseTheCollection: true
        };

        this.onClickTriggerRef = isCollectionOpen ? this.onBackClick : this.clickCollection;
        this.onSwipeUpRef = isCollectionOpen ? undefined : this.clickCollection;
        this.onMouseEnterTheCoverRef = isCollectionOpen ? this.onMouseEnterTheCover : undefined;
        this.onMouseLeaveTheCoverRef = isCollectionOpen ? this.onMouseLeaveTheCover : undefined;
        this.onProductClickRef = isCollectionOpen ? this.onProductClick : undefined;

        // Page Collections
        this.collectionsPage = getPage(props.pages, 'collections');

        // activeCategory
        const categoryIdFromSlug = getCategoryIdFromSlug(props.categories, props.params.slugCategory);
        this.activeCategory = (app.activeCategory !== categoryIdFromSlug)
            ? categoryIdFromSlug
            : app.activeCategory;

        // activeCollection
        const collectionIdFromSlug = getCollectionIdFromSlug(collections, props.params.slugCollection);
        if (app.activeCollection === null) {
            if (collectionIdFromSlug === null) {
                this.activeCollectionId = getFirstCollectionOfCategory(props.collections, this.activeCategory);
            } else {
                this.activeCollectionId = collectionIdFromSlug;
            }
        } else {
            if (app.activeCollection === collectionIdFromSlug) {
                this.activeCollectionId = app.activeCollection;
            } else {
                this.activeCollectionId = getFirstCollectionOfCategory(props.collections, this.activeCategory);
            }
        }

        // Current collection href
        this.currentCollection = getCollectionByIdCollection(collections, this.activeCollectionId);
        this.categoryHref = `${this.urlLangSuffix}/${this.collectionsPage.title}/${props.params.slugCategory}`;
        this.collectionImage = `${global.pD}${this.currentCollection.imageSrc || DEFAULT_IMG}`;
        this.collectionHref = `${this.categoryHref}${this.currentCollection.slug.length > 0 ? '/' + this.currentCollection.slug : '' }`;

        this.collectionsOfCurrentCategory = getCollectionsByIdCategory(collections, this.activeCategory);

        // Products
        this.productsOfCollection = getProductsByIdCollection(products, this.activeCollectionId);

        this.appState = this.getAppState(app);

        // Scroll Handler reference
        this.throttledScrollHandler = throttle(200, this.scrollHandler);

        // Images Preload - Covers of products
        this.preloadImages(products, this.activeCollectionId, true);
    }

    // Render methods should be a pure function of props and state;
    // constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.
    componentWillMount() {
        super.componentWillMount();

        const { app, categories, params, dispatch } = this.props;
        const { isAppLoading, pageLoaderState, activeCategory, activeCollection, activeProduct } = app;
        const { unsetMovingState } = appActionCreators;

        // -------------------------------------
        // Dispatch first actions (if necessary)
        // -------------------------------------
        const actions = [];
        // Update activeCategory
        if (activeCategory !== this.activeCategory) {
            actions.push(setActiveCategory(this.activeCategory));
        }
        // Update activeCollection
        if (activeCollection !== this.activeCollectionId) {
            actions.push(setActiveCollection(this.activeCollectionId));
        }
        // Unset Active Product
        if (typeof activeProduct === 'number') {
            actions.push(unsetActiveProduct());
        }
        // isCollectionOpen
        actions.push((params.slugCollection) ? setIsCollectionOpen() : unsetIsCollectionOpen());

        if (actions.length > 0) {
            dispatch(batchActions(actions));
        }

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = [
            showMenuTrigger,
            showReservedAreaLink,
            showVatNumber,
            showViewAllCollectionBtn,
            showLogo,
            unsetMovingState
        ];
        const currentCategoryIndex =  categories.findIndex(c => c.idCategory === this.activeCategory);
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
        super.componentDidMount();

        const { app, params } = this.props;
        const { isMobile, collectionOpenY } = app;

        this.getDOMReferences();

        // If isCollectionOpen
        if (params.slugCollection) {
            if (isMobile) {
                const headRect = this.headEl.getBoundingClientRect();
                const _collectionOpenY = (headRect.bottom - 150) * -1;
                TweenMax.set(this.headEl, { y: _collectionOpenY, position: 'fixed' });
            } else {
                TweenMax.set(this.headEl, { y: collectionOpenY, position: 'fixed' });
            }
            TweenMax.set(this.cover, { y: '30%' });
            if (this.openCollectionTrigger) {
                TweenMax.set(this.openCollectionTrigger, { autoAlpha: 0, display: 'none' });
            }
            if (this.buttons && this.buttons.length > 0) {
                TweenMax.set(this.buttons, { autoAlpha: 0, display: 'none' });
            }
            if (app.isMobile) {
                TweenMax.set(this.cover, { autoAlpha: 1 });
                TweenMax.set(this.mobileCover, { autoAlpha: 0 });
                TweenMax.set([this.naviNext, this.naviPrev], { opacity: 0, y: -30 });
            }
        } else {
            if (this.closeCollectionTrigger) {
                TweenMax.set(this.closeCollectionTrigger, {autoAlpha: 0, display: 'none'});
            }
        }
        if (this.indicator) {
            const currentIndex = this.collectionsOfCurrentCategory.findIndex(c => c.idCollection === this.activeCollectionId);
            TweenMax.set(this.indicator, { scaleX: 1 / this.collectionsOfCurrentCategory.length * (currentIndex + 1) });
        }

        // Add event listener
        document.addEventListener('keyup', this.keyboardHandler);
        if (app.isMobile || app.isTablet) {
            this.item.addEventListener('scroll', this.throttledScrollHandler, false);
        } else {
            window.addEventListener('scroll', this.throttledScrollHandler, false);
        }
    }

    componentDidUpdate(prevProps) {
        this.getDOMReferences();

        // Progress
        if (this.indicator && prevProps.app.isCollectionOpen !== this.props.app.isCollectionOpen) {
            const currentIndex = this.collectionsOfCurrentCategory.findIndex(c => c.idCollection === this.activeCollectionId);
            TweenMax.set(this.indicator, { scaleX: 1 / this.collectionsOfCurrentCategory.length * (currentIndex + 1) });
        }
    }

    componentWillUnmount() {
        // Remove event listener
        document.removeEventListener('keyup', this.keyboardHandler);
        window.removeEventListener('scroll', this.throttledScrollHandler);
    }

    componentWillUpdate(nextProps) {
        super.componentWillUpdate(nextProps);

        const { dispatch } = this.props;
        const actions = [];

        // Category is changed
        if (nextProps.params.slugCategory !== this.props.params.slugCategory) {
            // this.activeCategory update
            this.activeCategory = getCategoryIdFromSlug(nextProps.categories, nextProps.params.slugCategory);
            actions.push(setActiveCategory(this.activeCategory));
            // this.activeCollectionId update
            this.activeCollectionId = getFirstCollectionOfCategory(nextProps.collections, this.activeCategory);
            actions.push(setActiveCollection(this.activeCollectionId));

            // this.collectionsOfCurrentCategory update
            this.collectionsOfCurrentCategory = getCollectionsByIdCategory(nextProps.collections, this.activeCategory);
            // Update app.frameButtonState
            const currentCategoryIndex =  nextProps.categories.findIndex(c => c.slug === nextProps.params.slugCategory);
            actions.push((currentCategoryIndex === 0) ? frameButtonBookAnAppointment() : frameButtonStoreLocator());
        }
        if (actions.length > 0) {
            dispatch(batchActions(actions));
        }

        // activeCollection is changed (prev / next)
        if (nextProps.app.activeCollection !== this.props.app.activeCollection) {
            this.activeCollectionId = nextProps.app.activeCollection;
            // Products
            this.productsOfCollection = getProductsByIdCollection(nextProps.products, this.activeCollectionId);
            // Current collection href
            this.currentCollection = getCollectionByIdCollection(nextProps.collections, this.activeCollectionId);
            this.categoryHref = `${this.urlLangSuffix}/${this.collectionsPage.title}/${nextProps.params.slugCategory}`;
            this.collectionHref = `${this.categoryHref}${this.currentCollection.slug.length > 0 ? '/' + this.currentCollection.slug : '' }`;
        }

        // Enter/leave into/from collection
        if (nextProps.params.slugCollection !== this.props.params.slugCollection) {
            if (nextProps.params.slugCollection) {
                this.openCollectionAnimation();
            } else {
                this.closeCollectionAnimation();
            }
        }
        // isCollectionOpen is changed
        if (nextProps.app.isCollectionOpen !== this.props.app.isCollectionOpen) {
            this.onClickTriggerRef = nextProps.app.isCollectionOpen ? this.onBackClick : this.clickCollection;
            this.onSwipeUpRef = nextProps.app.isCollectionOpen ? undefined : this.clickCollection;
            this.onMouseEnterTheCoverRef = nextProps.app.isCollectionOpen ? this.onMouseEnterTheCover : undefined;
            this.onMouseLeaveTheCoverRef = nextProps.app.isCollectionOpen ? this.onMouseLeaveTheCover : undefined;
            this.onProductClickRef = nextProps.app.isCollectionOpen ? this.onProductClick : undefined;
        }

        // APPSTATE CACHING
        if (nextProps.app.frameButtonState !== this.props.app.frameButtonState
            || nextProps.app.isCollectionOpen !== this.props.app.isCollectionOpen
            || nextProps.app.isMoving !== this.props.app.isMoving
            || nextProps.app.isMobile !== this.props.app.isMobile
            || nextProps.app.isTablet !== this.props.app.isTablet
            || nextProps.app.windowHeight !== this.props.app.windowHeight
            || nextProps.app.windowWidth !== this.props.app.windowWidth
            || nextProps.app.collectionOpenY !== this.props.app.collectionOpenY
        ) {
            this.appState = this.getAppState(nextProps.app);
        }

        // Adjust topbar
        if (nextProps.app.isMobile && nextProps.app.collectionOpenY !== this.props.app.collectionOpenY) {
            TweenMax.set(this.headEl, { y: nextProps.app.collectionOpenY });
        }
    }

    /**
     * Preload the products cover images of a single collection
     * @param products - array, the table of products
     * @param activeCollection - int, the id of the collection
     * @param thumb - boolean, should it load the imageSrc or the thumbs? (w=200)
     * @returns {Promise}
     */
    preloadImages(products, activeCollection, thumb) {
        this.productsOfActiveCollection = getProductsByIdCollection(products, activeCollection);
        const activeCollectionImages = this.productsOfActiveCollection.map(p => thumb ? changeUrlParameter(changeUrlParameter(global.pD + p.imageSrc, 'w', 200), 'a.blur', 25) : global.pD + p.imageSrc);
        return Promise.all(activeCollectionImages.map(pic => preloadImage(pic)));
    }

    keyboardHandler(event) {
        const { params } = this.props;
        const { slugCollection } = params;
        switch (event.keyCode) {
        case 39:
            if (!slugCollection) {
                event.preventDefault();
                this.clickNext();
            }
            break;

        case 37:
            if (!slugCollection) {
                event.preventDefault();
                this.clickPrev();
            }
            break;

        case 38:
            if (slugCollection) {
                event.preventDefault();
                this.onBackClick();
            }
            break;

        case 40:
            if (!slugCollection) {
                event.preventDefault();
                this.clickCollection();
            }
            break;

        default:
            return false;
        }
    }

    clickNext() {
        const { app, products, params, dispatch } = this.props;
        const { isMoving, isCollectionOpen, activeCollection } = app;
        const currentIndex = this.collectionsOfCurrentCategory.findIndex(c => c.idCollection === activeCollection);
        const nextCurrent = currentIndex + 1 >= this.collectionsOfCurrentCategory.length ? 0 : currentIndex + 1;
        const nextItem = this.collectionsOfCurrentCategory[nextCurrent].idCollection;

        if (!isMoving && !isCollectionOpen) {

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': params.slugCategory,
                    'eventAction': 'home',
                    'eventLabel': 'next'
                });
            }

            // Images preload
            new Timeout(1000)
                .then(() => this.preloadImages(products, nextItem, true));

            this.setState({
                direction: 'left'
            }, () => {
                this.moveProgress(currentIndex, nextCurrent);
                dispatch(setActiveCollection(nextItem));
            });
        }
    }

    clickPrev() {
        const { app, products, dispatch } = this.props;
        const { isMoving, isCollectionOpen, activeCollection } = app;
        const currentIndex = this.collectionsOfCurrentCategory.findIndex(c => c.idCollection === activeCollection);
        const prevCurrent = currentIndex === 0 ? this.collectionsOfCurrentCategory.length - 1 : currentIndex - 1;
        const prevItem = this.collectionsOfCurrentCategory[prevCurrent].idCollection;

        if (!isMoving && !isCollectionOpen) {
            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': 'abiti',
                    'eventAction': 'home',
                    'eventLabel': 'prev'
                });
            }

            // Images preload
            new Timeout(1000)
                .then(() => this.preloadImages(products, prevItem, true));

            this.setState({
                direction: 'right'
            }, () => {
                this.moveProgress(currentIndex, prevCurrent);
                dispatch(setActiveCollection(prevItem));
            });
        }
    }

    wheelCollection(event) {
        const { app } = this.props;
        const { isCollectionOpen } = app;

        if (!isCollectionOpen) {
            if (event.nativeEvent.deltaY > 0) {
                event.preventDefault(); // Prevent first scroll inside the collection
                new Timeout(100)
                    .then(() => this.onClickTriggerRef());
            }
        } else {
            if (event.nativeEvent.deltaY > 0) {
                if (this.state.canWheelCloseTheCollection) {
                    this.setState({
                        canWheelCloseTheCollection: false
                    });
                }
            } else {
                const currentYPosition = window.pageYOffset || document.documentElement.scrollTop;
                if (this.state.canWheelCloseTheCollection && currentYPosition === 0) {
                    event.preventDefault(); // Prevent first scroll inside the collection
                    this.onBackClick();
                }
            }
        }
    }

    render() {
        const { app, categories, appBoundActionCreators, productBoundActionCreators } = this.props;
        const { isMoving, isMobile, isCollectionOpen, activeCategory, activeCollection, windowHeight } = app;

        const containerStyle = {
            minHeight: 0 //windowHeight
        };

        return (
            <div className="c-collections">
                <TransitionGroup className="c-collections__container" component="div" style={containerStyle} key="collection-container">
                    {
                        this.collectionsOfCurrentCategory
                            .filter(c => c.idCollection === this.activeCollectionId)
                            .map(c => <CollectionItem
                                        key={c.idCollection}
                                        href={this.collectionHref}
                                        appState={this.appState}
                                        collection={c}
                                        products={this.productsOfCollection}
                                        direction={this.state.direction}
                                        labels={this.labels}
                                        onClickTrigger={this.onClickTriggerRef}
                                        onWheelCollection={this.wheelCollection}
                                        onSwipeRight={this.clickPrev}
                                        onSwipeLeft={this.clickNext}
                                        onSwipeUp={this.onSwipeUpRef}
                                        onMouseEnterTheCover={this.onMouseEnterTheCoverRef}
                                        onMouseLeaveTheCover={this.onMouseLeaveTheCoverRef}
                                        onProductClick={this.onProductClickRef}
                                        onClickBookAnAppointment={this.openBookAnAppointmentOverlay}
                                        {...appBoundActionCreators}
                                        {...productBoundActionCreators}
                                    />
                            )
                    }
                </TransitionGroup>

                <TransitionGroup>
                    { isMobile && <CollectionMobileActions
                        frameButtonState={app.frameButtonState}
                        onClickBookAnAppointment={this.openBookAnAppointmentOverlay}
                        sendFormData={this.sendBookAnAppointmentForm}
                        isCollectionOpen={isCollectionOpen}
                        onClickTrigger={this.onClickTriggerRef}
                        backLabel={this.labels['back_to_collections']}
                    /> }
                </TransitionGroup>

                <TransitionGroup>
                    { !isCollectionOpen && <CollectionsProgress
                        key="CollectionsProgress"
                        windowHeight={windowHeight}
                        length={this.collectionsOfCurrentCategory.length}
                        categories={categories}
                        activeCategory={activeCategory}
                        current={activeCollection} /> }
                </TransitionGroup>

                <CollectionsNavi
                    key="CollectionsNavi"
                    isMobile={isMobile}
                    isMoving={isMoving}
                    clickNext={this.clickNext}
                    clickPrev={this.clickPrev} />

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:site_name', 'content': 'Claraluna.it'},
                        {'property': 'og:image', 'content': this.collectionImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );

    }

    sendBookAnAppointmentForm() {
        const { products } = this.props;

        const book        = document.querySelector('.o-book');
        const bookName    = document.getElementById('book-name');
        const bookMail    = document.getElementById('book-mail');
        const bookAtelier = document.getElementById('book-atelier');
        const bookData    = document.getElementById('book-data');
        const bookNote    = document.getElementById('book-notes');
        const bookPrivacy = document.getElementById('book-privacy');


        if (validation(bookName, bookMail, bookData, bookNote, bookPrivacy)) {
            this.setState({
                isFetching: true
            });

            // Prodotti in wishlist
            let bookWishlist = '';
            const productsInWishlist = getProductsFromIdArray(products, getCookie('claraluna_wishlist').split(','));
            if (productsInWishlist.length > 0) {
                productsInWishlist.map(p => {
                    bookWishlist += p.name + '<br />';
                });
            }

            sendData(book, bookAtelier, bookName, bookMail, bookData, bookNote, bookPrivacy, bookWishlist);

            new Timeout(4000)
                .then(() => this.setState({
                    isFetching: false
                }));
        }

        return false;
    }

    scrollHandler() {
        const {app} = this.props;

        if (!app.isMoving && app.isCollectionOpen && !this.ticking) {
            __CLIENT__ && window.requestAnimationFrame(this.headAnimations);
            this.ticking = true;
        }
    }

    headAnimations() {
        const {app} = this.props;
        const {windowHeight, collectionOpenY} = app;
        const currentYPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Detect scroll direction
        if (currentYPosition > this.state.yPosition) {
            // Downscroll
            if (!this.state.isHeadHidden && currentYPosition > 200) {
                this.setState({
                    isHeadHidden: true
                }, () => {
                    TweenMax.to(this.headEl, 0.7, { y: windowHeight * -1, ease: Power3.easeIn });
                    TweenMax.to(this.closeCollectionTrigger, 0.7, { autoAlpha: 0 });
                });
            }
        }
        if (currentYPosition < this.state.yPosition) {
            // Upscroll
            if (this.state.isHeadHidden) {
                this.setState({
                    isHeadHidden: false
                }, () => {
                    TweenMax.to(this.headEl, 0.7, { y: collectionOpenY, ease: Power3.easeOut });
                    TweenMax.to(this.closeCollectionTrigger, 0.7, { autoAlpha: 0 });
                });
            }

            // When you reach the top of the page,
            // set the can
            if (currentYPosition === 0) {
                this.showHeadBar();

                new Timeout(1000)
                    .then(() => this.setState({
                        canWheelCloseTheCollection: true
                    }));
            }
        }

        this.ticking = false;
        this.setState({
            yPosition: currentYPosition
        });
    }

    onProductClick(event, url) {
        event.preventDefault();

        const { appBoundActionCreators, app } = this.props;
        const { setMovingState } = appBoundActionCreators;
        const { isMobile, isTablet, windowHeight } = app;

        const done = () => browserHistory.push(url);

        // Start moving
        setMovingState();

        // Hide Product Thumbs
        if (isMobile || isTablet) {
            const thumb = document.querySelectorAll('.c-thumb');
            TweenMax.to(thumb, 0.5, {opacity: 0});
        } else {

            const thumbs = Array.from(this.el.querySelectorAll('.c-thumb.is-visible'));

            thumbs.map(p => {
                const thumbCover     = p.querySelector('.c-thumb__cover');
                const thumbReveal    = p.querySelector('.c-thumb__reveal');
                const thumbCaption   = p.querySelector('.c-thumb__caption');

                const leaveTl = new TimelineMax();
                leaveTl
                    .to(thumbReveal, 1, { scaleY: 1, ease: Expo.easeIn })
                    .set([thumbCover, thumbCaption], { visibility: 'hidden' })
                    .set(thumbReveal, { transformOrigin: '50% 0%' })
                    .to(thumbReveal, 0.7, { scaleY: 0, ease: Power3.easeOut });

            });
        }

        // Hide Description Box
        const box           = document.getElementById('description-box');
        const boxReveal     = box.querySelector('.c-box__reveal');
        const boxCover      = box.querySelector('.c-box__cover');
        const boxInnerTitle = box.querySelector('.c-box__inner > h4');
        const boxInnerDesc  = box.querySelector('.c-box__inner > p');

        const leaveTl = new TimelineMax();
        leaveTl
            .to(boxReveal, 1, { scaleY: 1, ease: Expo.easeInOut })
            .set([boxCover, boxInnerTitle, boxInnerDesc], { visibility: 'hidden' })
            .set(boxReveal, { transformOrigin: '50% 0%' })
            .to(boxReveal, 0.7, { scaleY: 0, ease: Power3.easeOut });

        // Hide Header
        TweenMax.to(this.headEl, 1, { y: (windowHeight + 150) * -1, delay: 1, ease: Power3.easeInOut, onComplete: done });
    }

    onMouseEnterTheCover() {
        const { app } = this.props;
        const { isMobile, isMoving, isCollectionOpen, collectionHoverY } = app;

        if (isCollectionOpen && !isMobile && !isMoving) {
            // this.closeCollectionTrigger = this.closeCollectionTrigger || this.el.querySelector('.c-trigger--close-col');
            this.setState({
                isHeadHidden: false
            }, () => {
                TweenMax.to(this.headEl, 0.5, { y: collectionHoverY, ease: Power3.easeOut });
                TweenMax.to(this.closeCollectionTrigger, 0.3, { autoAlpha: 1 });
            });
        }
    }

    onMouseLeaveTheCover() {
        const { app } = this.props;
        const { isMobile, isMoving, collectionOpenY } = app;
        const currentYPosition = window.pageYOffset || document.documentElement.scrollTop;
        // if this.closeCollectionTrigger doesn't exist
        // we didn't hover the topbar yet
        if (app.isCollectionOpen && !isMobile && !isMoving && currentYPosition > 0) {
            this.setState({
                isHeadHidden: false
            }, () => {
                TweenMax.to(this.headEl, 0.7, { y: collectionOpenY, ease: Power3.easeOut });
                TweenMax.to(this.closeCollectionTrigger, 0.3, { autoAlpha: 0 });
            });
        }
    }

    clickCollection(event) {
        const { app, params } = this.props;
        const { isMoving } = app;

        if (event && event.type === 'click') {
            event.preventDefault();
        }

        if (!isMoving) {
            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': params.slugCategory,
                    'eventAction': this.currentCollection.name,
                    'eventLabel': 'accedi'
                });
            }

            // Pushstate
            browserHistory.push(this.collectionHref);
        }
    }

    onBackClick(event) {
        const { app } = this.props;
        const { isMoving } = app;

        if (event && event.type === 'click') {
            event.preventDefault();
        }

        if (!isMoving) {
            browserHistory.push(this.categoryHref);
        }
    }

    moveProgress(previousIndex, nextIndex) {
        if (previousIndex + 1 === this.collectionsOfCurrentCategory.length && nextIndex === 0) {
            const tl = new TimelineMax();
            tl
                .set(this.indicator, { transformOrigin: '100% 50%' })
                .to(this.indicator, 1, { scaleX: 0, ease: Power3.easeIn })
                .set(this.indicator, { transformOrigin: '0% 50%' })
                .to(this.indicator, 1, { scaleX: 1 / this.collectionsOfCurrentCategory.length, ease: Expo.easeOut });
        } else if (previousIndex === 0 && nextIndex === this.collectionsOfCurrentCategory.length - 1) {
            const tl = new TimelineMax({ onComplete: () => {
                TweenMax.set(this.indicator, { clearProps: 'transformOrigin' });
            }});
            tl
                .set(this.indicator, { transformOrigin: '0% 50%' })
                .to(this.indicator, 1, { scaleX: 0, ease: Power3.easeIn })
                .set(this.indicator, { transformOrigin: '100% 50%' })
                .to(this.indicator, 1, { scaleX: 1, ease: Expo.easeOut });
        } else {
            TweenMax.to(this.indicator, 1.5, { scaleX: 1 / this.collectionsOfCurrentCategory.length * (nextIndex + 1), ease: Expo.easeInOut });
        }
    }

    openCollectionAnimation() {
        return new Promise((resolve) => {
            const { app, appBoundActionCreators, dispatch } = this.props;
            const { isMoving, isMobile, isTablet, collectionOpenY, collectionHoverY, windowWidth, windowHeight } = app;
            const { setMovingState, unsetMovingState } = appBoundActionCreators;

            // Start moving
            setMovingState();
            dispatch(setIsCollectionOpen());

            TweenMax.set(document.body, { position: 'fixed', width: windowWidth, height: windowHeight });

            new Timeout(3000)
                .then(() => {
                    unsetMovingState();
                    if (!isMoving && !isMobile && !isTablet) {
                        TweenMax.to(this.headEl, 0.7, { y: collectionOpenY + 'px', ease: Power3.easeInOut });
                        TweenMax.to(this.closeCollectionTrigger, 0.3, { autoAlpha: 0 });
                    }
                });

            const done = () => {
                TweenMax.set(this.headEl, { position: 'fixed' });

                new Timeout(1)
                    .then(() => resolve());

                new Timeout(1000)
                    .then(() => TweenMax.set(document.body, { clearProps: 'position,height' }));
            };

            const tl = new TimelineMax({ onComplete: done });

            if (isMobile) {
                const headRect = this.headEl.getBoundingClientRect();
                const _collectionOpenY = (headRect.bottom - 150) * -1;

                tl
                    .to(this.headEl, 1, { y: _collectionOpenY + 'px', ease: Power3.easeInOut })
                    .insert(TweenMax.to(this.mobileCover, 0.5, { opacity: 0, delay: 0.5 }), 0)
                    .insert(TweenMax.to(this.cover, 1, { opacity: 1, y: '30%', ease: Power3.easeInOut }), 0)
                    .insert(TweenMax.to(this.progressBar, 0.5, { opacity: 0 }), 0)
                    .insert(TweenMax.to(this.buttons, 0.5, { opacity: 0 }), 0)
                    .insert(TweenMax.staggerTo([this.naviNext, this.naviPrev], 0.3, { opacity: 0, y: -30 }, 0.1), 0);
            } else {
                tl
                    .to(this.headEl, 1, { y: (isTablet ? collectionOpenY : collectionHoverY) + 'px', ease: Power3.easeInOut })
                    .insert(TweenMax.to(this.underline, 0.5, { scaleX: 0, ease: Power3.easeOut }), 0)
                    .insert(TweenMax.staggerTo(this.letters, 0.7, { y: '-100%', opacity: 0, ease: Power3.easeOut }, 0.02), 0)
                    .insert(TweenMax.to(this.cover, 1, {y: '30%', ease: Power3.easeInOut }), 0)
                    .insert(TweenMax.to(this.progressBar, 0.5, { opacity: 0, scaleY: 0.2, ease: Expo.easeInOut }), 0)
                    .insert(TweenMax.staggerTo([this.naviNext, this.naviPrev], 0.3, { opacity: 0, y: -30 }, 0.1), 0)
                    .insert(TweenMax.to(this.openCollectionTrigger, 0.3, { autoAlpha: 0, display: 'none', y: '-100%', ease: Power3.easeInOut }), 0)
                    .insert(TweenMax.to(this.closeCollectionTrigger, 0.3, { display: 'block', autoAlpha: 1, delay: 0.5 }), 1);
            }
        });
    }

    showHeadBar() {
        const { app } = this.props;
        const { collectionHoverY } = app;

        TweenMax.to(this.headEl, 1, { y: collectionHoverY + 'px', ease: Power3.easeInOut });
        TweenMax.to(this.closeCollectionTrigger, 0.7, { autoAlpha: 1 });
    }

    closeCollectionAnimation() {
        return new Promise((resolve) => {

            const { app, appBoundActionCreators, dispatch } = this.props;
            const { setMovingState, unsetMovingState } = appBoundActionCreators;
            const { isMoving, isMobile } = app;

            if (!isMoving) {

                setMovingState();

                const done = () => {
                    dispatch(unsetIsCollectionOpen());
                    unsetMovingState();
                    new Timeout(1)
                        .then(() => resolve());
                };

                const showTimeLine = new TimelineMax({onComplete: done});

                if (isMobile) {
                    showTimeLine
                        .to(this.closeCollectionTrigger, 0.3, {opacity: 0})
                        .to(this.bodyEl, 0.7, {opacity: 0})
                        .insert(TweenMax.to(this.headEl, 1, {y: 0, ease: Power3.easeInOut}), 0)
                        .insert(TweenMax.to(this.mobileCover, 0.5, { autoAlpha: 1 }), 0.5)
                        .insert(TweenMax.to(this.cover, 1, { y: '0%', autoAlpha: 0.05, ease: Power3.easeInOut }), 0)
                        .insert(TweenMax.staggerTo(this.buttons, 0.5, { display: 'inline-block', autoAlpha: 1, ease: Power3.easeInOut }, 0.1), 0.3)
                        .insert(TweenMax.staggerTo([this.naviNext, this.naviPrev], 0.3, { opacity: 1, y: 0 }, 0.1), 0.5);
                } else {
                    showTimeLine
                        .to(this.headEl, 1, {y: 0, ease: Power3.easeInOut})
                        .insert(TweenMax.staggerFromTo(this.letters, 0.3, {y: '-100%', opacity: 0}, {
                            y: '0%',
                            opacity: 1
                        }, 0.02), 0.5)
                        .insert(TweenMax.staggerFromTo(this.underline, 0.6, {scaleX: 0}, {
                            scaleX: 1,
                            ease: Power3.easeInOut
                        }, 0.1), 0.5)
                        .insert(TweenMax.to(this.cover, 1, {y: '0%', ease: Power3.easeInOut}), 0)
                        .insert(TweenMax.staggerTo([this.naviNext, this.naviPrev], 0.3, { opacity: 1, y: 0 }, 0.1), 0.5)
                        .insert(TweenMax.to(this.closeCollectionTrigger, 0.3, { autoAlpha: 0, display: 'none' }), 0)
                        .insert(TweenMax.to(this.openCollectionTrigger, 0.3, { display: 'block', autoAlpha: 1, y: '0%' }), 0.4);
                }
            }

        });
    }

    openBookAnAppointmentOverlay() {
        const { isMoving, frameButtonBoundActionCreators } = this.props;
        const { frameButtonSend } = frameButtonBoundActionCreators;

        if (!isMoving) {
            frameButtonSend();
        }
    }

    getAppState(app) {
        return {
            isCollectionOpen: __CLIENT__ ? app.isCollectionOpen : true,
            isMoving: app.isMoving,
            isMobile: app.isMobile,
            isTablet: app.isTablet,
            collectionOpenY: app.collectionOpenY,
            windowHeight: app.windowHeight,
            windowWidth: app.windowWidth,
            frameButtonState: app.frameButtonState
        };
    }

    getDOMReferences() {
        this.el                     = findDOMNode(this);
        this.item                   = this.el.querySelector('.c-collections__item');
        this.container              = this.el.querySelector('.c-collections__container');
        this.indicator              = this.el.querySelector('.c-collections__indicator');
        this.headEl                 = this.el.querySelector('.c-collections__head');
        this.bodyEl                 = this.el.querySelector('.c-collections__body');
        this.openCollectionTrigger  = this.el.querySelector('.c-trigger--open-col');
        this.closeCollectionTrigger = this.el.querySelector('.c-trigger--close-col');
        this.naviNext               = this.el.querySelector('.c-circle--coll-navi-next');
        this.naviPrev               = this.el.querySelector('.c-circle--coll-navi-prev');
        this.progressBar            = this.el.querySelector('.c-collections__progress');
        this.letters                = Array.from(this.el.querySelectorAll('.js-collection__letters'));
        this.underline              = this.el.querySelectorAll('.c-collections__name u');
        this.cover                  = this.el.querySelector('.c-collections__cover');
        this.buttons                = this.el.querySelectorAll('.c-circle--coll-cta');
        // Mobile
        this.mobileCover            = this.el.querySelector('.c-collections__mob-cover');
    }
}

Collections.propTypes = {
    collections: React.PropTypes.array.isRequired,
    app: React.PropTypes.object.isRequired,
    appBoundActionCreators: React.PropTypes.object.isRequired,
    productBoundActionCreators: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    app: state.app,
    categories: state.categories,
    collections: state.collections,
    products: state.products,
    pages: state.pages,
    labels: state.labels,
    seo: state.seo,
    routing: state.routing
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    frameButtonBoundActionCreators: bindActionCreators(frameButtonActionCreators, dispatch),
    appBoundActionCreators: bindActionCreators(appActionCreators, dispatch),
    productBoundActionCreators: bindActionCreators(productActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Collections);


/** WEBPACK FOOTER **
 ** ./containers/PageCollections/page-Collections.jsx
 **/
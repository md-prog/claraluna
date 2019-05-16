import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import TransitionGroup from 'react-addons-transition-group';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import config from '../../routes/config';
import Helmet from 'react-helmet';

// Utilities
import { bindFunctions, getLabels, getDevice, getCookie, setCookie, Timeout, preloadImage, validateEmail } from '../../utilities/utils';
import { getCollectionsByIdCategory, getProductsFromIdArray } from '../../utilities/collections';
import { getUrlLang } from '../../utilities/pages';
import { validation, sendData } from '../../utilities/bookAnAppointment';

// Action
import { showPageLoader } from '../../components/Loader/actions-PageLoader';
import { openMenu, closeMenu } from '../../components/Menu/actions-menu';
import { setAppLoaded, setMobile, unsetMobile, setTablet, unsetTablet, setWindowCoordinates, setFetching, unsetFetching } from './actions-app';
import { addWishItem } from '../PageWishlist/actions-wishlist';
import * as frameActionCreators from '../../components/Frame/actions-frame';
import * as frameButtonActionCreators from '../../components/FrameButton/actions-frameButtonState';
import { showCookie, acceptCookie } from '../../components/CookieLaw/actions-cookielaw';

// Components
import { TweenMax } from 'gsap';
import SplitText from 'gsap/src/uncompressed/utils/SplitText';
import Menu from '../../components/Menu/Menu.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import PageLoader from '../../components/Loader/PageLoader.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import CollectionArchiveTrigger from '../../components/Collections/CollectionArchiveTrigger.jsx';
import Frame from '../../components/Frame/Frame.jsx';
import Trigger from '../../components/Buttons/Trigger.jsx';
import CircleIcon from '../../components/Buttons/CircleIcon.jsx';
import BookOverlay from '../../components/BookOverlay/BookOverlay.jsx';
import FrameButton from '../../components/FrameButton/FrameButton.jsx';
import MenuTrigger from '../../components/Menu/MenuTrigger.jsx';
import CookieLaw from '../../components/CookieLaw/CookieLaw.jsx';
import LandscapeAlert from '../../components/Landscape/LandscapeAlert.jsx';

export class App extends Component {

    constructor(props) {
        super(props);

        const { app, pages, categories, collections, labels } = props;

        this.state = {
            isLoaded: false,
            idFetching: false,
            isLandscape: false,
            isBookAnAppointmentClosing: false
        };

        this.boundedShowPageLoader = bindActionCreators(showPageLoader, props.dispatch);
        this.boundAppLoaded = bindActionCreators(setAppLoaded, props.dispatch);

        this.urlLangSuffix = getUrlLang(app.lang);
        this.shortLang = app.lang.substr(0, 2);

        this.labels = getLabels(labels, [
            'url_store_locator',
            'url_collection_archive',
            'url_privacy',
            'rotate_device',
            'italian',
            'german',
            'name',
            'reserved_area',
            'thanks',
            'accept_privacy',
            'privacy',
            'wedding_date',
            'e_mail',
            'phone',
            'note',
            'cookies_text',
            'cookies_accept',
            'cookies_policy_link',
            'view_all_collections',
            'send',
            'book_an_appointment',
            'store_locator',
            'choose_atelier'
        ]);

        this.prevFrameButtonState = null;
        this.bookAnAppointmentPage = pages.find(page => page.name === 'book-appointment') || {};
        this.urlPrivacy = `${this.urlLangSuffix}/privacy`;
        this.appState = this.getAppStateObject(app);

        // Menu items
        this.normalizedMenuItems = props.menuItems.map(mI => Object.assign(mI, {
            href: mI.href.startsWith('/') ? `${mI.href}` : `${this.urlLangSuffix}/${mI.href}`
        }));

        // Archive collection
        this.storeLocatorHref = `${this.urlLangSuffix}/${this.labels['url_store_locator'] ? this.labels['url_store_locator'] : ''}`;
        this.collectionArchiveHref = `${this.urlLangSuffix}/${this.labels['url_collection_archive'] ? '/' + this.labels['url_collection_archive'] : ''}`;
        this.archivedCollections = getCollectionsByIdCategory(collections, categories[0].idCategory, true);

        bindFunctions.call(this, [
            'menuTriggerHandler',
            'cleanMenuCharsProperties',
            'clickMenuLink',
            'clickReservedArea',
            'clickLogo',
            'clickStoreLocator',
            'viewAllCollectionHandler',
            'sendBookAnAppointmentForm',
            'onAcceptCookieLaw',
            'clickPrivacy',
            'closeBookAnAppointmentOverlay'
        ]);

    }

    componentWillMount() {
        const { dispatch, loaderActionCreators } = this.props;

        if (__CLIENT__) {
            this.cacheWindowCoordinates();
            if (getCookie('cookie_policy_accepted') !== '') {
                dispatch(acceptCookie());
            } else {
                dispatch(showCookie());
            }

            // Show the frame immediately
            loaderActionCreators.setFrameVisible();

            this.insertWishlistItemsFromCookie(getCookie('claraluna_wishlist'));
        }
    }

    componentDidMount() {
        if (__CLIENT__) {
            const { collections } = this.props;

            window.addEventListener('resize', this.cacheWindowCoordinates.bind(this));
            window.addEventListener('orientationchange', this.checkLandscape.bind(this));

            this.el = findDOMNode(this);
            this.menuItemsElements = Array.from(this.el.querySelectorAll('.o-menu__item > a'));

            this.menuItemsElements.forEach(item => {
                const splittedItem = new SplitText(item, { type: 'chars', charsClass: 'o-menu__char' });
            });

            this.menuItemsChars = Array.from(this.el.querySelectorAll('.o-menu__char'));

            this.preloadImages(collections.map(c => global.pD + c.imageSrc));
        }
    }

    preloadImages(images) {
        return Promise.all(images.map(pic => preloadImage(pic)));
    }

    componentWillUpdate(nextProps) {
        const { app } = this.props;

        // If you change page, you accept the cookie law
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.onAcceptCookieLaw();
        }

        if ( nextProps.app.isMenuOpen !== app.isMenuOpen
            || nextProps.app.windowWidth !== app.windowWidth
            || nextProps.app.windowHeight !== app.windowHeight
        ) {
            this.appState = this.getAppStateObject(nextProps.app);
        }
    }

    componentWillUnmount() {
        if (__CLIENT__) {
            window.removeEventListener('resize', this.cacheWindowCoordinates.bind(this));
        }
    }

    getAppStateObject(app) {
        return {
            lang: app.lang,
            isMobile: app.isMobile,
            isMenuOpen: app.isMenuOpen,
            windowWidth: app.windowWidth,
            windowHeight: app.windowHeight
        };
    }

    insertWishlistItemsFromCookie(cookieVal) {
        if (typeof cookieVal !== 'string' || cookieVal === '') {
            return false;
        }

        const { products, dispatch } = this.props;
        const idArray = cookieVal.split(',');
        const productsInWishlist = getProductsFromIdArray(products, idArray);

        if (idArray.length > 0) {
            dispatch(productsInWishlist.map(prod => addWishItem(parseInt(prod.idProduct, 10))));
        }

        return true;
    }

    cacheWindowCoordinates() {
        const { dispatch, app } = this.props;
        const { windowWidth } = app;
        const mq = getDevice();

        // collectionOpenY, collectionHoverY, windowHeight
        dispatch(setWindowCoordinates());

        // isMobile
        if (mq === 'mobile' && !app.isMobile) {
            dispatch(setMobile());
        } else if (mq !== 'mobile' && app.isMobile) {
            dispatch(unsetMobile());
        }

        // isTablet
        if ((mq === 's-tablet' || mq === 'l-tablet') && !app.isTablet) {
            dispatch(setTablet());
        } else if (mq !== 's-tablet' && mq !== 'l-tablet' && app.isTablet) {
            dispatch(unsetTablet());
        }

        TweenMax.set(document.body, { width: __CLIENT__ ? window.innerWidth : 0 });
    }

    menuTriggerHandler() {
        const { app, dispatch, frameButtonBoundActionCreators } = this.props;
        const { isMoving, isMenuOpen, frameButtonState } = app;
        const { hideFrameButton } = frameButtonBoundActionCreators;

        if (!isMoving) {
            if (isMenuOpen === 1) {
                dispatch(openMenu());
                this.prevFrameButtonState = frameButtonState;
                hideFrameButton();
                this.openMenuAnimation();
                //
                // Analytics action
                if (__CLIENT__) {
                    window.dataLayer.push({
                        'event': 'GAevent',
                        'eventCategory': 'menu',
                        'eventAction': 'open',
                        'eventLabel': 'open'
                    });
                }
            } else {
                dispatch(closeMenu());
                this.showFrameButtonFromPrevState(this.prevFrameButtonState);
                new Timeout(800)
                    .then(() => this.cleanMenuCharsProperties());
            }
        }
    }

    openMenuAnimation() {
        // Chars animation
        this.menuItemsChars.forEach(char => {
            const delay = (Math.random() * 0.8) + 0.2; // 0.2 - 0.8
            const duration = 4 - delay;

            TweenMax.fromTo(char, duration, {
                opacity: 0
            }, {
                opacity: 1,
                delay: delay,
                ease: Power3.easeOut
            });
        });
    }

    cleanMenuCharsProperties() {
        this.menuItemsChars.forEach(char => {
            TweenMax.killTweensOf(char);
            TweenMax.set(char, {clearProps: 'opacity, transform'});
        });
    }

    showFrameButtonFromPrevState(prevState) {
        const {frameButtonBoundActionCreators} = this.props;
        const action = {
            [0]: frameButtonBoundActionCreators.hideFrameButton,
            [1]: frameButtonBoundActionCreators.frameButtonBookAnAppointment,
            [2]: () => true,
            [3]: frameButtonBoundActionCreators.frameButtonStoreLocator
        };

        return action[prevState] ? action[prevState]() : false;
    }

    clickMenuLink(href, name) {
        return e => {
            e.preventDefault();
            const { app, dispatch } = this.props;

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': 'menu',
                    'eventAction': 'select',
                    'eventLabel': name
                });
            }

            if (href === '/' || href === '/de') {
                window.location.href = href;
            } else {
                browserHistory.push(href);
                dispatch(closeMenu());

                new Timeout(1000)
                    .then(() => this.cleanMenuCharsProperties());
            }
        };
    }

    clickReservedArea() {
        //
        // Analytics
        if (__CLIENT__) {
            window.dataLayer.push({
                'event': 'GAevent',
                'eventCategory': 'area-riservata',
                'eventAction': 'go',
                'eventLabel': 'go'
            });
        }

        const win = window.open('https://ecommerce.claraluna.it/', '_blank');
        win.focus();
    }

    onAcceptCookieLaw() {
        const { dispatch } = this.props;

        setCookie('cookie_policy_accepted', 'accepted', 365);
        dispatch(acceptCookie());
    }

    clickLogo(event) {
        event.preventDefault();
        const homeHref = this.urlLangSuffix.startsWith('/') ? this.urlLangSuffix : '/';

        this.boundedShowPageLoader()
            .then(() => browserHistory.push(homeHref))
            .catch((reason) => console.warn(reason));
    }

    clickStoreLocator() {
        const { app } = this.props;

        if (!app.isMoving) {
            this.boundedShowPageLoader()
                .then(() => browserHistory.push(this.storeLocatorHref))
                .catch((reason) => console.warn(reason));
        }
    }

    sendBookAnAppointmentForm() {
        const { app, products, dispatch } = this.props;

        // Prevent double click
        if (app.isFetching) {
            return false;
        }

        const book        = document.querySelector('.o-book');
        const bookName    = document.getElementById('book-name');
        const bookMail    = document.getElementById('book-mail');
        const bookAtelier = document.getElementById('book-atelier');
        const bookPhone   = document.getElementById('book-phone');
        const bookData    = document.getElementById('book-data');
        const bookNote    = document.getElementById('book-notes');
        const bookPrivacy = document.getElementById('book-privacy');

        if (validation(bookName, bookMail, bookPhone, bookData, bookNote, bookPrivacy)) {
            dispatch(setFetching());

            // Prodotti in wishlist
            let bookWishlist = '';
            const productsInWishlist = getProductsFromIdArray(products, getCookie('claraluna_wishlist').split(','));
            if (productsInWishlist.length > 0) {
                productsInWishlist.map(p => {
                    bookWishlist += p.name + '<br />';
                });
            }

            sendData(book, bookAtelier, bookName, bookMail, bookPhone, bookData, bookNote, bookPrivacy, bookWishlist);

            new Timeout(4000)
                .then(() => dispatch(unsetFetching()));
        }

        return false;
    }

    viewAllCollectionHandler() {
        if (this.collectionArchiveHref.length > 0) {
            this.boundedShowPageLoader()
                .then(() => browserHistory.push(this.collectionArchiveHref))
                .catch((reason) => console.warn(reason));
        } else {
            console.warn('this.collectionArchiveHref is an empty string');
        }
    }

    clickPrivacy() {
        return false;
    }

    closeBookAnAppointmentOverlay() {
        const { frameButtonBoundActionCreators } = this.props;
        const { frameButtonBookAnAppointment } = frameButtonBoundActionCreators;

        return new Promise((resolve, reject) => {
            this.setState({
                isBookAnAppointmentClosing: true
            }, () => {
                new Timeout(1000)
                    .then(() => {
                        frameButtonBookAnAppointment();
                        this.setState({
                            isBookAnAppointmentClosing: false
                        });
                        resolve();
                    });
            });
        });
    }

    checkLandscape() {
        const { app } = this.props;

        if (__CLIENT__ && app.isMobile && (window.orientation === 90 || window.orientation === -90)) {
            this.setState({
                isLandscape: true
            });
        } else {
            this.setState({
                isLandscape: false
            });
        }
    }

    render() {

        const {
            children,
            categories,
            menuCategories,
            app,
            atelier,
            collections,
            frameButtonBoundActionCreators
        } = this.props;

        const {
            isFrameVisible,
            isMenuOpen,
            isZoomActive,
            isMoving,
            isMobile,
            isFetching,
            lang,
            pageLoaderState,
            logoState,
            vatNumberState,
            reservedAreaState,
            viewAllCollectionState,
            frameButtonState,
            windowWidth,
            windowHeight,
            isCookieEnabled
        } = app;

        // App Class
        let appClass = lang === 'it-IT' ? 'u-lang-it' : 'u-lang-de';
        appClass += isFrameVisible ? ' is-frame-visible' : '';
        appClass += isMoving ? ' is-moving' : '';
        appClass += isZoomActive ? ' is-zoom-open' : '';

        const loaderBg = collections[0] ? collections[0].imageSrc : '';

        return (
            <div className={`o-app ${appClass}`}>
                <header>
                    {
                        global.loader &&
                            <Loader
                                appState={this.appState}
                                categories={categories}
                                loaded={this.state.isLoaded}
                                bg={loaderBg}
                                setAppLoaded={this.boundAppLoaded}
                            />
                    }

                    <Frame modifier="o-frame--top" />
                    <Frame modifier="o-frame--bottom" />
                    <Frame modifier="o-frame--left" />
                    <Frame modifier="o-frame--right" />

                    { !isMobile && <CookieLaw
                        isCookieEnabled={isCookieEnabled}
                        onAcceptCookieLaw={this.onAcceptCookieLaw}
                        text={this.labels['cookies_text']}
                        labelAccept={this.labels['cookies_accept']}
                        labelCookiePolicy={this.labels['cookies_policy_link']}
                    /> }

                    <PageLoader pageLoaderState={pageLoaderState} />

                    <LandscapeAlert isLandscape={this.state.isLandscape} labels={this.labels} />

                    <Link onClick={this.clickLogo} to={this.urlLangSuffix.startsWith('/') ? this.urlLangSuffix : '/'}>
                        <Logo
                            modifier={`c-logo--main ${logoState > 0 ? 'is-visible' : ''}`}
                            lang={lang}
                        />
                    </Link>

                    <MenuTrigger
                        isMenuOpen={isMenuOpen}
                        onClickTrigger={this.menuTriggerHandler}
                    />

                    { <Trigger
                        onClickTrigger={this.clickReservedArea}
                        modifier="c-trigger--reserved-area"
                        btnModifier={`c-btn c-btn--reserved-area ${reservedAreaState > 0 ? 'is-visible' : ''}`}
                    >
                        { isMobile
                                ? (<i className="o-ico o-ico--reserved-area"></i>)
                                : this.labels['reserved_area']
                        }
                    </Trigger> }

                    { this.archivedCollections.length > 0 && <CollectionArchiveTrigger
                        onClickTrigger={this.viewAllCollectionHandler}
                        viewAllCollectionState={viewAllCollectionState}
                        label={this.labels['view_all_collections']}
                    /> }

                    <Trigger
                        onClickTrigger={this.clickPrivacy}
                        modifier="c-trigger--privacy"
                        btnModifier={`c-btn c-btn--privacy ${vatNumberState > 0 ? 'is-visible' : ''}`}>
                        P.IVA 01597390986
                    </Trigger>

                    <TransitionGroup>
                        { frameButtonState > 0 &&
                            <FrameButton
                                labels={this.labels}
                                frameButtonState={frameButtonState}
                                isMoving={isMoving}
                                sendFormData={this.sendBookAnAppointmentForm}
                                storeLocatorCallback={this.clickStoreLocator}
                                {...frameButtonBoundActionCreators}
                            />
                        }
                    </TransitionGroup>

                    <TransitionGroup>
                        { frameButtonState === 2 &&
                            <CircleIcon
                                modifier="c-circle--close t-white"
                                icon="o-ico--close"
                                onClickCB={this.closeBookAnAppointmentOverlay}
                            />
                        }
                    </TransitionGroup>

                    <BookOverlay
                        frameButtonState={frameButtonState}
                        appState={{windowWidth, windowHeight}}
                        page={this.bookAnAppointmentPage}
                        atelier={atelier}
                        isFetching={isFetching}
                        urlPrivacy={this.urlPrivacy}
                        showPageLoader={this.boundedShowPageLoader}
                        labels={this.labels}
                        isClosing={this.state.isBookAnAppointmentClosing}
                        {...frameButtonBoundActionCreators}
                    />

                    <Menu
                        labels={this.labels}
                        items={this.normalizedMenuItems}
                        categories={menuCategories}
                        appState={this.appState}
                        onClickLink={this.clickMenuLink}
                    />
                </header>

                <main>{children}</main>
                <Helmet {...config.app.head} htmlAttributes={{lang: this.shortLang}} />
            </div>
        );
    }
}

// children, menuItems, menuCategories, app, pages, atelier, dispatch, collections
App.propTypes = {
    app: React.PropTypes.object.isRequired,
    menuCategories: React.PropTypes.array.isRequired,
    menuItems: React.PropTypes.array.isRequired,
    pages: React.PropTypes.array.isRequired,
    atelier: React.PropTypes.array.isRequired,
    categories: React.PropTypes.array.isRequired,
    collections: React.PropTypes.array.isRequired,
    products: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    loaderActionCreators: React.PropTypes.object.isRequired,
    frameButtonBoundActionCreators: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    app: state.app,
    categories: state.categories,
    collections: state.collections,
    products: state.products,
    menuItems: state.menuItems,
    menuCategories: state.menuCategories,
    pages: state.pages,
    labels: state.labels,
    atelier: state.atelier
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    loaderActionCreators: bindActionCreators(frameActionCreators, dispatch),
    frameButtonBoundActionCreators: bindActionCreators(frameButtonActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);



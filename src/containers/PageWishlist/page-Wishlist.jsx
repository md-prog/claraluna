import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-transition-group';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Utilities
import { bindFunctions, setCookie, arrayEqual } from '../../utilities/utils';
import { getPage } from '../../utilities/pages';

// Action Creators
import { showPageLoader, hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { removeWishItem } from './actions-wishlist';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Sub components
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import WishlistTitle from '../../components/Wishlist/WishlistTitle.jsx';
import WishlistCategory from '../../components/Wishlist/WishlistCategory.jsx';
import WishlistCounter from '../../components/Wishlist/WishlistCounter.jsx';
import WishlistGrid from '../../components/Wishlist/WishlistGrid.jsx';
import WishlistMessage from '../../components/Wishlist/WishlistMessage.jsx';

export class Wishlist extends PageContainer {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['removeFromWishlist', 'clickProductThumb']);
        this.boundedShowPageLoader = bindActionCreators(showPageLoader, props.dispatch);

        this.page = props.pages.find(p => p.name === 'wishlist');
        this.wishlistImage = global.pD + (this.page.bgImage || DEFAULT_IMG);
        this.seoParams = this.getSeoParams('pages', this.page);
        this.wishlistData = [];
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, wishlist, dispatch, frameActionCreators } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        // Frame actions
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => { this.dispatchActions(app, this.afterLoaderActions, dispatch); })
                .catch(reasons => console.warn(reasons));
        }

        // Wishlist data
        this.wishlistData = this.getWishlistData(wishlist);
    }

    componentWillUpdate(nextProps) {
        super.componentWillUpdate(nextProps);

        const { wishlist } = nextProps;

        // Update cookie wishlist
        if (!arrayEqual(wishlist, this.props.wishlist)) {
            setCookie('claraluna_wishlist', wishlist.toString(), 60);
            this.wishlistData = this.getWishlistData(wishlist);
        }
    }

    getWishlistData(wishlist) {
        const { categories, collections, products, pages } = this.props;

        return wishlist.map(w => {
            // Page Collections
            const collectionsPage = getPage(pages, 'collections');
            const product = products.find(p => p.idProduct === w);
            const collection = collections.find(c => c.idCollection === product.idCollection);
            const category = categories.find(cat => cat.idCategory === collection.idCategory);
            const href = `${this.urlLangSuffix}/${collectionsPage.title}/${category.slug}/${collection.slug}/${product.slug}`;
            return Object.assign({}, {...product}, {
                categoryName: category.name,
                idCategory: category.idCategory,
                href
            });
        });
    }

    removeFromWishlist(idProduct) {
        const { dispatch } = this.props;
        return event => {
            event.preventDefault();
            dispatch(removeWishItem(idProduct));
        };
    }

    clickProductThumb(href) {
        return event => {
            event.preventDefault();

            if (href.length > 0) {
                this.boundedShowPageLoader()
                    .then(() => browserHistory.push(href))
                    .catch((reason) => console.warn(reason));
            } else {
                console.warn('Product href is an empty string');
            }
        };
    }

    render() {
        const { app, categories } = this.props;
        const { isMobile } = app;
        const { bgImage, title } = this.page;
        const hasData = this.wishlistData.length > 0 ? true : false;

        return (
            <div className="o-wishlist">
                <BackgroundImage src={`${global.pD || ''}${bgImage}`} />

                <div className="o-wishlist__container o-wishlist__container--left">
                    { ! isMobile && <WishlistTitle title={title} /> }
                    <div>
                        {
                            categories.map(c => <WishlistCategory
                                key={c.idCategory}
                                name={c.name}
                                counter={this.wishlistData.filter(w => w.idCategory === c.idCategory).length} />)
                        }
                    </div>
                    { ! isMobile && <WishlistCounter counter={this.wishlistData.length} />}
                </div>

                <div className="o-wishlist__container o-wishlist__container--right">
                    { isMobile && <WishlistTitle title={title} /> }
                    { isMobile && <WishlistCounter counter={this.wishlistData.length} /> }

                    {
                        ! hasData && (<WishlistMessage>{this.page.description}</WishlistMessage>)
                    }

                    {
                        hasData &&
                            <WishlistGrid
                                clickProductThumb={this.clickProductThumb}
                                categories={categories}
                                wishlistData={this.wishlistData}
                                removeFromWishlist={this.removeFromWishlist}
                                isMobile={isMobile}
                            />
                    }

                </div>

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:image', 'content': this.wishlistImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }
}

Wishlist.propTypes = {
    app: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array.isRequired,
    products: React.PropTypes.array.isRequired,
    pages: React.PropTypes.array.isRequired,
    wishlist: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    frameActionCreators: React.PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
    dispatch,
    frameActionCreators: {
        showMenuTrigger,
        showVatNumber,
        showViewAllCollectionBtn,
        showLogo,
        showReservedAreaLink,
        hideFrameButton
    }
});

const mapStateToProps = state => ({
    app: state.app,
    categories: state.categories,
    collections: state.collections,
    products: state.products,
    pages: state.pages,
    wishlist: state.wishlist,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);


/** WEBPACK FOOTER **
 ** ./containers/PageWishlist/page-Wishlist.jsx
 **/
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import viewBag from './viewBag';
import appReducer from '../containers/App/reducer-app';
import menuCategoriesReducer from '../components/Menu/reducer-menuCategories';
import menuItemsReducer from '../components/Menu/reducer-menuItems';
import categoriesReducer from '../containers/PageHome/reducer-categories';
import collectionsReducer from '../containers/PageCollections/reducer-collections';
import productsReducer from '../containers/PageProduct/reducer-products';
import departmentsReducer from '../containers/PagePeople/reducer-departments';
import peopleReducer from '../containers/PagePeople/reducer-people';
import galleriesReducer from '../containers/PageProduct/reducer-galleries';
import pagesReducer from '../containers/App/reducer-pages';
import atelierReducer from '../containers/PageAtelier/reducer-atelier';
import labelsReducer from '../containers/App/reducer-labels';
import wishlistReducer from '../containers/PageWishlist/reducer-wishlist';
import storesReducer from '../containers/PageStoreLocator/reducer-stores';
import socialWallReducer from '../containers/PageAttitude/reducer-attitude';
import seoReducer from '../containers/App/reducer-seo';
import invitationsReducer from '../containers/PageInvitations/reducer-invitations';

export default combineReducers({
    app: appReducer,
    categories: categoriesReducer,
    collections: collectionsReducer,
    departments: departmentsReducer,
    menuCategories: menuCategoriesReducer,
    menuItems: menuItemsReducer,
    people: peopleReducer,
    products: productsReducer,
    atelier: atelierReducer,
    labels: labelsReducer,
    stores: storesReducer,
    galleries: galleriesReducer,
    pages: pagesReducer,
    wishlist: wishlistReducer,
    socialWall: socialWallReducer,
    invitations: invitationsReducer,
    seo: seoReducer,
    routing: routerReducer,
    viewBag
});


/** WEBPACK FOOTER **
 ** ./redux/reducer.js
 **/
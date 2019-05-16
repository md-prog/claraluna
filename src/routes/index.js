import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

// Container Components
import App from '../containers/App/App.jsx';
import Attitude from '../containers/PageAttitude/page-Attitude.jsx';
import Atelier from '../containers/PageAtelier/page-Atelier.jsx';
import Home from '../containers/PageHome/page-Home.jsx';
import Collections from '../containers/PageCollections/page-Collections.jsx';
import CollectionArchive from '../containers/PageCollectionArchive/page-CollectionArchive.jsx';
import Product from '../containers/PageProduct/page-Product.jsx';
import Contacts from '../containers/PageContacts/page-Contacts.jsx';
import People from '../containers/PagePeople/page-People.jsx';
import Newsletter from '../containers/PageNewsletter/page-Newsletter.jsx';
import Wishlist from '../containers/PageWishlist/page-Wishlist.jsx';
import StoreAbiti from '../containers/PageStoreLocator/page-StoresAbiti.jsx';
import StoreBomboniere from '../containers/PageStoreLocator/page-StoresBomboniere.jsx';
import Invitations from '../containers/PageInvitations/page-Invitations.jsx';
import Privacy from '../containers/PagePrivacy/page-Privacy.jsx';
import Page404 from '../containers/Page404/page-404.jsx';

const subRoutesIT = menuItems => (
    <Route>
        <IndexRoute component={Home} />
        <Route path="collezioni/:slugCategory(/:slugCollection)">
            <IndexRoute component={Collections} />
            <Route path=":slugProduct" component={Product} />
            <Route path="*" component={Page404} />
        </Route>
        <Route path="archivio-collezioni" component={CollectionArchive} />
        // People
        <Route path="persone" component={People} />
        // Attitude
        <Route path="attitude" component={Attitude} />
        // Atelier
        {menuItems.find(m => m.href === '/atelier') ? (
            <Route path="atelier" component={Atelier} />
        ) : (
            <Redirect from="atelier" to="/" />
        )}
        // Contacts
        <Route path="contatti" component={Contacts} />
        // Newsletter
        <Route path="newsletter" component={Newsletter} />
        // Wishlist
        <Route path="wishlist" component={Wishlist} />
        // Store locator
        <Route path="punti-vendita/abiti" component={StoreAbiti} />
        <Route path="punti-vendita/bomboniere" component={StoreBomboniere} />
        // Invitations
        <Route path="partecipazioni-omaggio" component={Invitations} />
        // Privacy page
        <Route path="privacy" component={Privacy} />
        // 404
        <Route path="*" component={Page404} />
    </Route>
);

const subRoutesDE = menuItems => (
    <Route>
        <IndexRoute component={Home} />
        <Route path="sammlungen/:slugCategory(/:slugCollection)">
            <IndexRoute component={Collections} />
            <Route path=":slugProduct" component={Product} />
            <Route path="*" component={Page404} />
        </Route>
        <Route path="andere-kollektionen" component={CollectionArchive} />
        // People
        <Route path="personen" component={People} />
        // Attitude
        <Route path="attitude" component={Attitude} />
        // Atelier
        {menuItems.find(m => m.href === '/atelier') ? (
            <Route path="atelier" component={Atelier} />
        ) : (
            <Redirect from="atelier" to="/" />
        )}
        // Contacts
        <Route path="kontakt" component={Contacts} />
        // Newsletter
        <Route path="newsletter" component={Newsletter} />
        // Wishlist
        <Route path="wishlist" component={Wishlist} />
        // Store locator
        <Route path="laden/kleidung" component={StoreAbiti} />
        <Route path="laden/hochzeit-favorisiert" component={StoreBomboniere} />
        // Invitations
        <Route path="deine-teilnahmerkarten" component={Invitations} />
        // Privacy page
        <Route path="privacy" component={Privacy} />
        // 404
        <Route path="*" component={Page404} />
    </Route>
);

const routes = (menuItems) => (
    <Route path="/" component={App}>
        <Route path="it">
            { subRoutesIT(menuItems) }
        </Route>
        <Route path="de">
            { subRoutesDE(menuItems) }
        </Route>
        { subRoutesIT(menuItems) }
    </Route>
);

export default routes;




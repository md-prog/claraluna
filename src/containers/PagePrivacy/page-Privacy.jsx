import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';

// Utilities
import { deentitizeHtml } from '../../utilities/utils';

// Actions Creators
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { frameButtonBookAnAppointment } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Components
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';

class Privacy extends PageContainer {

    constructor(props) {
        super(props);

        this.page = props.pages.find(p => p.name === 'privacy');

        this.seoParams = this.getSeoParams('pages', this.page);

        this.privacyText = deentitizeHtml(this.page.description);
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, frameActionCreators, dispatch } = this.props;
        const { isAppLoading } = app;

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        if (!isAppLoading) {
            // Frame actions
            const pageLoaderPromise = (app.pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    render() {
        const privacyPage = this.page;

        return (
            <div className="o-page">
                <BackgroundImage src={privacyPage.bgImage} />
                <h1 className="o-page__title">{privacyPage.title}</h1>
                <span className="u-text--geometric u-text--primary">Scroll</span>
                <div className="o-page__content" dangerouslySetInnerHTML={{__html: this.privacyText}} />
                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    dispatch,
    frameActionCreators: {
        showMenuTrigger,
        showVatNumber,
        showViewAllCollectionBtn,
        showLogo,
        frameButtonBookAnAppointment,
        showReservedAreaLink
    }
});

const mapStateToProps = (state) => ({
    app: state.app,
    pages: state.pages,
    seo: state.seo,
    routing: state.routing
});

export default connect(mapStateToProps, mapDispatchToProps)(Privacy);


/** WEBPACK FOOTER **
 ** ./containers/PagePrivacy/page-Privacy.jsx
 **/
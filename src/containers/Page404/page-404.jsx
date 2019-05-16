import React from 'react';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';

// Action creators
import { hidePageLoader, showPageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Components
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';

export class Page404 extends PageContainer {

    constructor(props) {
        super(props);

        this.seoParams = this.getSeoParams('pages', props.pages.find(p => p.name === '404'));

        this.page = props.pages.find(p => p.name === '404') || {};
    }

    componentWillMount() {
        const { app, dispatch, pageLoaderState, frameActionCreators } = this.props;
        const { isAppLoading } = app;

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props

        if (!isAppLoading) {

            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => { this.dispatchActions(app, this.afterLoaderActions, dispatch); })
                .catch(reasons => console.warn(reasons));
        }
    }

    componentWillUpdate(nextProps) {
        const { app, dispatch } = nextProps;
        // If App loader just gone...
        if (app.isAppLoading !== this.props.app.isAppLoading) {
            this.dispatchActions(app, this.afterLoaderActions, dispatch);
        }
    }

    render() {

        const bgImage = this.page.bgImage || '';

        return (
            <div className="o-page-404">
                <BackgroundImage src={`${global.pD || ''}${bgImage}`} />
                <h1 className="u-text--title">{ this.page.title }</h1>
                <div className="o-page-404__inner" dangerouslySetInnerHTML={{ __html: this.page.description }} />
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
        hideFrameButton,
        showReservedAreaLink
    }
});

const mapStateToProps = state => ({
    app: state.app,
    pages: state.pages,
    atelier: state.atelier,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Page404);



/** WEBPACK FOOTER **
 ** ./containers/Page404/page-404.jsx
 **/
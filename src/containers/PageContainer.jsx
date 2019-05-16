import React, {Component} from 'react';
import {batchActions} from 'redux-batched-actions';
import getSeoInformation from '../routes/seoInformations';
import { getUrlLang } from '../utilities/pages';
import { URL_ORIGIN } from '../constants';

class PageContainer extends Component {

    constructor(props) {
        super(props);

        this.urlLangSuffix = getUrlLang(props.app.lang);

        this.seoInfo = {};
    }

    componentDidMount() {
        if (!this.seoInfo.title) {
            const { seo } = this.props;
            const idSeo = parseInt(this.seoParams.id, 10);
            const type = this.seoParams.type || '';
            this.seoInfo = getSeoInformation(seo, idSeo, type) || {};
        }
    }

    componentWillMount() {
        const { seo, location } = this.props;

        const idSeo = parseInt(this.seoParams.id, 10);
        const type = this.seoParams.type || '';
        const url = URL_ORIGIN + location.pathname;
        this.seoInfo = getSeoInformation(seo, idSeo, type, url) || {};
    }

    componentWillUpdate(nextProps) {
        const { app, dispatch } = nextProps;
        // If App loader just gone...
        if (app.isAppLoading !== this.props.app.isAppLoading) {
            this.dispatchActions(app, this.afterLoaderActions, dispatch);
        }
    }

    /**
     * Dispatch an object of action creators
     * https://github.com/ashaffer/redux-multi
     * @param actions - object - Object of action creators
     * @param dispatch - function = Dispatch function
     */
    dispatchActions(state = {}, actions = {}, dispatch) {
        // Build an array of action creator functions
        const actionCreators = [];
        const skipActionCreator = {
            ['showMenuTrigger']: () => state.isMenuOpen === 1,
            ['showVatNumber']: () => state.vatNumberState === 1,
            ['showViewAllCollectionBtn']: () => state.viewAllCollectionState === 1,
            ['showReservedAreaLink']: () => state.showReservedAreaLink === 1,
            ['showLogo']: () => state.logoState === 1,
            ['frameButtonBookAnAppointment']: () => state.frameButtonState === 1,
            ['unsetIsCollectionOpen']: () => !state.isCollectionOpen,
            ['setIsCollectionOpen']: () => state.isCollectionOpen,
            ['hideFrameButton']: () => state.frameButtonState === 0,
            ['hideLogo']: () => state.logoState === 0,
            ['hideVatNumber']: () => state.vatNumberState === 0,
            ['hideViewAllCollectionBtn']: () => state.viewAllCollectionState === 0,
            ['hideMenuTrigger']: () => state.isMenuOpen === 0
        };

        Object.keys(actions).map(a => {
            if (!skipActionCreator[a] || !skipActionCreator[a]()) {
                actionCreators.push(actions[a]);
            }
        });

        // Loop through that array and execute each function within the dispatch
        if (actionCreators.length >= 1) {
            dispatch(batchActions(actionCreators.map(a => a())));
        }
    }

    getSeoParams(type, page) {
        const idSeo = page ? page.idSeo : null;
        return {
            type,
            id: idSeo
        };
    }
}

PageContainer.propTypes = {
    app: React.PropTypes.object.isRequired,
    seo: React.PropTypes.array,
    routing: React.PropTypes.object,
    location: React.PropTypes.object
};

export default PageContainer;



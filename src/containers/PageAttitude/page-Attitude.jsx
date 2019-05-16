import React from 'react';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
// Utilities
import { getLabels } from '../../utilities/utils';
// Actions Creators
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import SocialItem from '../../components/SocialWall/SocialItem.jsx';

class Attitude extends PageContainer {
    constructor(props) {
        super(props);

        this.page = props.pages.find(p => p.name === 'attitude');
        this.seoParams = this.getSeoParams('pages', this.page);

        this.labels = getLabels(props.labels, []);

        this.socialItems = [];
        props.socialWall.map(sw => this.socialItems.push(Object.assign({}, sw, {
            width: this.getWidthFromSocialType(sw.type),
            icon: this.getIconFromSocialType(sw.type)
        })));
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, dispatch, frameBoundActionCreators } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameBoundActionCreators); // Copy of props

        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    getWidthFromSocialType(type) {
        const types = {
            ['youtube']: 2
        };
        return types[type] ? types[type] : 1;
    }

    getIconFromSocialType(type) {
        const modifier = {
            ['youtube']: 'o-ico--youtube',
            ['instagram']: 'o-ico--instagram',
            ['facebook']: 'o-ico--facebook',
            ['twitter']: 'o-ico--twitter'
        };
        return modifier[type] ? modifier[type] : '';
    }

    render() {
        return (
            <div className="o-attitude">
                <BackgroundImage src={`${global.pD || ''}${this.page.bgImage}`} />

                <div className="o-attitude__container o-social">
                    <div className="o-social__container">
                        {
                            this.socialItems.map(socialItem => {
                                let width = socialItem.width > 1 ? 't-double' : '';
                                width += socialItem.type === 'twitter' || socialItem.type === 'facebook' ? 't-text' : '';
                                return (
                                    <SocialItem
                                        modifier={width}
                                        key={socialItem.idEntry}
                                        {...socialItem}
                                    />
                                );
                            })
                        }
                        <div className="u-clear"></div>
                    </div>
                </div>

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
    frameBoundActionCreators: {
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
    labels: state.labels,
    socialWall: state.socialWall,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Attitude);


/** WEBPACK FOOTER **
 ** ./containers/PageAttitude/page-Attitude.jsx
 **/
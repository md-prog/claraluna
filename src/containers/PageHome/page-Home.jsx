import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TransitionGroup from 'react-addons-transition-group';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Actions
import { showPageLoader, hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { hideLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { hideViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { hideMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Components
import Helmet from 'react-helmet';
import Logo from '../../components/Logo/Logo.jsx';
import HomeSwitcher from '../../components/Home/HomeSwitcher.jsx';
import HomeTips from '../../components/Home/HomeTips.jsx';

// Utilities
import { bindFunctions, getLabels, Timeout } from '../../utilities/utils';
import { getPage } from '../../utilities/pages';

export class Home extends PageContainer {

    constructor(props) {
        super(props);

        const { pages, labels } = this.props;

        this.page = props.pages.find(p => p.name === 'home');
        this.seoParams = this.getSeoParams('pages', this.page);

        this.labels = getLabels(labels, [
            'choose_option',
            'discover_models',
            'discover_lines',
            'are_you_stranger'
        ]);

        this.state = {
            selection: -1
        };
        this.collectionsPage = getPage(pages, 'collections');
        this.homepageImage = global.pD + (props.categories[0] ? props.categories[0].imageSrc : DEFAULT_IMG);

        this.timer;

        bindFunctions.call(this, ['clickCategory', 'mouseEnterCategory', 'mouseLeaveCategory', 'changeLang']);
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, frameActionCreators, dispatch } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        if (!isAppLoading) {
            // Hide page loader
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);
            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    componentWillUnmount() {
        this.timer && this.timer.clear();
    }

    clickCategory(slug) {
        const { dispatch } = this.props;
        return event => {
            dispatch(showPageLoader())
                .then(() => browserHistory.push(`${this.urlLangSuffix}/${this.collectionsPage.title}/${slug}`))
                .catch((reason) => console.warn(reason));
        };
    }

    mouseEnterCategory(categoryIndex) {
        return event => {
            if (typeof this.timer !== 'undefined') {
                this.timer.clear();
            }

            this.setState({
                selection: categoryIndex
            });
        };
    }

    mouseLeaveCategory() {
        const { app } = this.props;
        if (!app.isMoving) {
            this.timer = new Timeout(500)
                .then(() => this.setState({ selection: -1 }));
        }
    }

    changeLang(href) {
        return event => {
            event.preventDefault();
            window.location.href = href;
        };
    }

    render() {
        const { categories, app } = this.props;
        const { isMobile, lang, windowWidth, windowHeight } = app;

        const langHref = lang === 'it-IT' ? '/de' : '/';
        return (
            <div className="o-home">

                <Logo modifier="c-logo--home" lang={lang} />

                <HomeSwitcher
                    isMobile={isMobile}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    categories={categories}
                    selection={this.state.selection}
                    onCategoryClick={this.clickCategory}
                    onCategoryMouseEnter={this.mouseEnterCategory}
                    onCategoryMouseLeave={this.mouseLeaveCategory}
                />

                <div className="o-home__tips">
                    <HomeTips>
                        <a href={langHref} onClick={this.changeLang(langHref)}>{this.labels['are_you_stranger']}</a>
                    </HomeTips>
                </div>

                {/*
                <TransitionGroup className="o-home__tips">
                    { (this.state.selection === -1) && <HomeTips>{ this.labels['choose_option'] }</HomeTips> }
                </TransitionGroup>

                <TransitionGroup className="o-home__tips">
                    { (this.state.selection === 0) && <HomeTips>{ this.labels['discover_models'] }</HomeTips> }
                </TransitionGroup>

                <TransitionGroup className="o-home__tips">
                    { (this.state.selection === 1) && <HomeTips>{ this.labels['discover_lines'] }</HomeTips> }
                </TransitionGroup>
                */}

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                            {'name': 'description', 'content': this.seoInfo.description},
                            {'property': 'og:site_name', 'content': 'Claraluna.it'},
                            {'property': 'og:image', 'content': this.homepageImage},
                            {'property': 'og:title', 'content': this.seoInfo.title},
                            {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }
}

Home.propTypes = {
    app: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    dispatch,
    frameActionCreators: {
        hideFrameButton,
        hideLogo,
        showVatNumber,
        hideViewAllCollectionBtn,
        hideMenuTrigger,
        showReservedAreaLink
    }
});

const mapStateToProps = state => ({
    app: state.app,
    pages: state.pages,
    categories: state.categories,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);


/** WEBPACK FOOTER **
 ** ./containers/PageHome/page-Home.jsx
 **/
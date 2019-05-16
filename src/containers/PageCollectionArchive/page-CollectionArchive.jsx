import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { bindFunctions } from '../../utilities/utils';
import { getCategorySlugFromId } from '../../utilities/collections';

// Actions Creators
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { frameButtonBookAnAppointment } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { hideViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Utilities
import { getCollectionsByIdCategory } from '../../utilities/collections';
import { getPage } from '../../utilities/pages';

// Comopnents
import DraggableWrapper from '../../components/DraggableWrapper/DraggableWrapper.jsx';
import CollectionThumb from '../../components/Collections/CollectionThumb.jsx';
import Helmet from 'react-helmet';

class CollectionArchive extends PageContainer {
    constructor(props) {
        super(props);

        const { app, categories, collections } = this.props;
        const { isMobile, windowWidth } = app;

        bindFunctions.call(this, ['getSnapArray', 'clickCollection']);

        this.seoParams = this.getSeoParams('pages', props.pages.find(p => p.name === 'collection-archive'));

        // Page Collections
        this.collectionsPage = getPage(props.pages, 'collections');
        this.collectionArchivePage = getPage(props.pages, 'collection-archive');

        // 10 = page columns
        // 4 = columns for each thumb
        this.archivedCollections = getCollectionsByIdCategory(collections, categories[0].idCategory, true);

        const collectionsAmount = this.archivedCollections.length;
        this.itemWidth = isMobile ? windowWidth - 40 : Math.ceil(windowWidth / 10 * 4);
        this.draggableWidth = this.itemWidth * collectionsAmount;
        this.initialXPosition = (windowWidth / 2) - (this.itemWidth / 2);
        this.snapArray = this.getSnapArray(0, this.itemWidth);

        this.collectionsData = this.archivedCollections.map(c => Object.assign(c, {
            href: `${this.urlLangSuffix}/${this.collectionsPage.title}/${getCategorySlugFromId(categories, c.idCategory)}/${c.slug}`
        }));
    }

    componentWillMount() {
        const { app, frameActionCreators, dispatch } = this.props;
        // Frame actions
        const pageLoaderPromise = (app.pageLoaderState > 0)
            ? dispatch(hidePageLoader())
            : Promise.resolve(true);

        pageLoaderPromise
            .then(() => this.dispatchActions(app, frameActionCreators, dispatch))
            .catch(reasons => console.warn(reasons));
    }

    componentWillUpdate(nextProps) {
        const { app } = this.props;
        const { isMobile, windowWidth } = app;

        if (nextProps.app.windowWidth !== windowWidth) {
            const collectionsAmount = this.archivedCollections.length;
            this.itemWidth = isMobile ? nextProps.app.windowWidth - 40 : Math.ceil(nextProps.app.windowWidth / 10 * 4);
            this.draggableWidth = this.itemWidth * collectionsAmount;
            this.initialXPosition = (nextProps.app.windowWidth / 2) - (this.itemWidth / 2);
            this.snapArray = this.getSnapArray(0, this.itemWidth);
        }
    }

    getSnapArray(initialPoint, size = 300) {
        const { collections } = this.props;

        return collections.reduce((previousValue, currentValue, currentIndex) => {
            let prevValue = previousValue[currentIndex - 1];
            if (Number.isFinite(prevValue)) {
                previousValue.push(prevValue - size);
            } else {
                previousValue.push(initialPoint);
            }
            return previousValue;
        }, []);
    }

    clickCollection(event, url) {
        browserHistory.push(url);
    }

    render() {

        const itemStyle = {
            width: this.itemWidth
        };

        return (
            <div className="c-collections">
                <div className="o-archive">
                    <div className="o-archive__heading">
                        <div className="o-archive__heading-wrapper">
                            { this.collectionArchivePage.description }
                        </div>
                    </div>
                    <div className="o-archive__collections">
                        <DraggableWrapper
                            modifier="o-archive__draggable"
                            width={this.draggableWidth}
                            snapArray={this.snapArray}
                            initialXPosition={this.initialXPosition}
                        >
                            {
                                this.collectionsData.map(c => (
                                    <div className="o-archive__item" style={itemStyle} key={c.idCollection}>
                                        <CollectionThumb
                                            name={c.name}
                                            image={c.imageSrc}
                                            onCollectionClick={this.clickCollection}
                                            href={c.href}
                                        />
                                    </div>
                                ))
                            }
                        </DraggableWrapper>
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
    frameActionCreators: {
        showMenuTrigger,
        showVatNumber,
        hideViewAllCollectionBtn,
        showLogo,
        frameButtonBookAnAppointment,
        showReservedAreaLink
    }
});

const mapStateToProps = (state) => ({
    app: state.app,
    pages: state.pages,
    categories: state.categories,
    collections: state.collections,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionArchive);


/** WEBPACK FOOTER **
 ** ./containers/PageCollectionArchive/page-CollectionArchive.jsx
 **/
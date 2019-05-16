import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';

import { bindFunctions, getLabels } from '../../utilities/utils';
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import InvitationsContainer from '../../components/Invitations/InvitationsContainer.jsx';

// Action Creators
import {hidePageLoader} from '../../components/Loader/actions-PageLoader';
import {frameButtonStoreLocator} from '../../components/FrameButton/actions-frameButtonState';
import {showLogo} from '../../components/Logo/actions-logo';
import {showVatNumber} from '../../components/Frame/actions-vat-number';
import {showViewAllCollectionBtn} from '../../components/Collections/actions-CollectionArchiveTrigger';
import {showMenuTrigger} from '../../components/Menu/actions-menu';
import {showReservedAreaLink} from '../../components/Frame/actions-reserved-area';

export class Invitations extends PageContainer {
    constructor(props) {
        super(props);

        const {labels} = props;

        this.seoParams = this.getSeoParams('invitations', null);

        this.labels = getLabels(labels, [
            'download_pdf',
            'drag_or_scroll'
        ]);
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, dispatch, pageLoaderState, frameActionCreators } = this.props;
        const { isAppLoading } = app;

        this.afterLoaderActions = frameActionCreators;

        if (! isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    getSnapArray(atelierPics = [], initialPoint = 0, size = 300) {

        // const elements = [{ width: 1 }].concat(atelierPics);
        // const elements = atelierPics;

        return atelierPics.reduce((prev, curr, currIndex, array) => {
            let prevValue = prev[currIndex - 1];
            if (Number.isFinite(prevValue)) {
                curr.width === 2 || array[currIndex - 1].width === 2
                    ? prev.push(prevValue - size * 1.5)
                    : prev.push(prevValue - size);

                // Last item
                if (currIndex === array.length - 1) {
                    prev.push(prev[prev.length - 1] - size);
                }
            } else {
                prev.push(initialPoint);
            }
            return prev;
        }, []);
    }

    render() {
        const {app, invitations} = this.props;
        const { isMoving, isMobile, isTablet, windowWidth, windowHeight } = app;
        const {title, description, attachment, pics} = invitations;
        const bgImage = invitations.bgImage || '';

        const itemWidth = (isMobile || isTablet) ? windowWidth - 40 : Math.round(windowWidth / 10 * 5);
        const picArray = pics || [];
        const totalPicsWidth = picArray.reduce((prev, curr) => prev + parseInt(curr.width || 1, 10), 0);
        const draggableWidth = (itemWidth * pics.length) + (itemWidth * totalPicsWidth);
        const initialXPosition = Math.round((windowWidth / 2) - ((itemWidth) / 2));
        const snapArray = this.getSnapArray(picArray, 0, itemWidth);

        return (
            <div className="o-invitations">
                <BackgroundImage src={`${global.pD || ''}${bgImage}`} />

                <InvitationsContainer
                    labels={this.labels}
                    draggable={{
                        draggableWidth,
                        snapArray,
                        initialXPosition
                    }}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    isMoving={isMoving}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    itemWidth={itemWidth}
                    title={title}
                    description={description}
                    attachment={attachment}
                    pics={picArray}
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
        frameButtonStoreLocator,
        showReservedAreaLink
    }
});

const mapStateToProps = (state) => ({
    app: state.app,
    invitations: state.invitations,
    seo: state.seo,
    labels: state.labels,
    routing: state.routing
});

export default connect(mapStateToProps, mapDispatchToProps)(Invitations);


/** WEBPACK FOOTER **
 ** ./containers/PageInvitations/page-Invitations.jsx
 **/
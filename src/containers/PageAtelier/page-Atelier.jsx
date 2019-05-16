import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-transition-group';

import { bindFunctions, getLabels } from '../../utilities/utils';

// Action Creators
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { frameButtonBookAnAppointment } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import Cities from '../../components/Atelier/Cities.jsx';
import AtelierContainer from '../../components/Atelier/AtelierContainer.jsx';

export class Atelier extends PageContainer {

    constructor(props) {
        super(props);

        const { labels } = props;

        this.seoParams = this.getSeoParams('pages', props.pages.find(p => p.name === 'atelier'));

        bindFunctions.call(this, ['clickBackButton', 'clickCityCallback', 'clickNextButton']);

        this.labels = getLabels(labels, [
            'view_atelier',
            'next_atelier',
            'back_to_overview',
            'address',
            'phone'
        ]);

        this.state = {
            display: 'cities',
            city: null,
            animationType: null
        };

        this.atelierImage = global.pD + props.atelier[0].addresses[0].pics[0].imageSrc;

        this.atelierPage = props.pages.find(p => p.name === 'atelier') || {};
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

        const elements = [{ width: 1 }].concat(atelierPics);

        return elements.reduce((prev, curr, currIndex, array) => {
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

    clickCityCallback(city) {
        return event => {
            event.preventDefault();

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': 'atelier',
                    'eventAction': city,
                    'eventLabel': 'accedi'
                });
            }

            this.setState({
                display: 'detail',
                city
            });
        };
    }

    clickNextButton(city) {
        return event => {
            event.preventDefault();
            this.setState({
                animationType: 'left'
            }, () => {
                this.setState({
                    animationType: null,
                    city
                });
            });
        };
    }

    clickBackButton() {
        event.preventDefault();
        this.setState({
            display: 'cities',
            city: null
        });
    }

    render() {
        const {app, atelier} = this.props;
        const {isMoving, isMobile, isTablet, windowWidth, windowHeight} = app;

        const bgImage = this.atelierPage.bgImage || '';

        const showCities = this.state.display === 'cities';
        const showDetail = this.state.display === 'detail';

        return (
            <div className="o-atelier">
                <BackgroundImage src={`${global.pD || ''}${bgImage}`} />

                <TransitionGroup>
                    {
                        showCities &&
                            <Cities
                                isMobile={isMobile}
                                labels={this.labels}
                                atelier={atelier}
                                onCityClick={this.clickCityCallback}
                                windowWidth={windowWidth}
                                windowHeight={windowHeight}
                            />
                    }
                </TransitionGroup>

                <TransitionGroup>
                    {
                        showDetail &&
                            atelier.map((a, i) => {
                                if (a.city === this.state.city) {
                                    let nextCity = {},
                                        itemWidth = 0,
                                        picArray = [],
                                        totalPicsWidth = 0,
                                        draggableWidth = 0,
                                        initialXPosition = 0,
                                        snapArray = [];

                                    if (a.addresses) {
                                        nextCity = atelier[i + 1] ? atelier[i + 1] : atelier[0];
                                        // 10 = page columns
                                        // 4 = columns for each thumb
                                        itemWidth = (isMobile || isTablet) ? windowWidth - 40 : Math.round(windowWidth / 10 * 4);
                                        picArray = a.addresses[0].pics || [];
                                        totalPicsWidth = picArray.reduce((prev, curr) => prev + parseInt(curr.width, 10), 0);
                                        draggableWidth = (itemWidth * atelier.length) + (itemWidth * totalPicsWidth);
                                        initialXPosition = Math.round((windowWidth / 2) - ((itemWidth) / 2));
                                        snapArray = this.getSnapArray(picArray, 0, itemWidth);
                                    }

                                    return (
                                        <AtelierContainer
                                            key={i}
                                            labels={this.labels}
                                            draggable={{
                                                draggableWidth,
                                                snapArray,
                                                initialXPosition
                                            }}
                                            windowWidth={windowWidth}
                                            windowHeight={windowHeight}
                                            isMoving={isMoving}
                                            clickBackButton={this.clickBackButton}
                                            clickNextButton={this.clickNextButton}
                                            pics={picArray}
                                            itemWidth={itemWidth}
                                            currentCity={a}
                                            nextCity={nextCity}
                                            animationType={this.state.animationType}
                                        />
                                    );
                                }
                                return false;
                            })

                    }
                </TransitionGroup>

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:site_name', 'content': 'Claraluna.it'},
                        {'property': 'og:image', 'content': this.atelierImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }
}

Atelier.propTypes = {
    pages: React.PropTypes.array.isRequired,
    menuItems: React.PropTypes.array.isRequired,
    atelier: React.PropTypes.array.isRequired
};

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

const mapStateToProps = state => ({
    app: state.app,
    pages: state.pages,
    menuItems: state.menuItems,
    atelier: state.atelier,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Atelier);


/** WEBPACK FOOTER **
 ** ./containers/PageAtelier/page-Atelier.jsx
 **/
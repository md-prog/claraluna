import React from 'react';
import TransitionGroup from 'react-addons-transition-group';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';

// Constants
import { DEFAULT_IMG, API_STORES } from '../../constants';

// Utilities
import { bindFunctions, getLabels, throttle, Timeout } from '../../utilities/utils';
import http from '../../utilities/http';

// Components
import Helmet from 'react-helmet';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import googleMapsStyle from '../../constants/googleMapsStyle';
import { GoogleMapLoader, GoogleMap, InfoWindow, Marker, SearchBox } from 'react-google-maps';
import { default as MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

// Actions Creators
import { hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

class StoresBomboniere extends PageContainer {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['handleBoundsChanged', 'handlePlacesChanged', 'handleSidebarToggle']);

        const { labels, categories } = props;

        this.category = categories[1];
        this.categoryIndex = 1;

        this.storeLocatorPage = props.pages.find(p => p.name === 'store-locator');
        this.storeLocatorImage = global.pD + (this.storeLocatorPage.bgImage || DEFAULT_IMG);
        this.seoParams = this.getSeoParams('pages', this.storeLocatorPage);

        this.labels = getLabels(labels, [
            'view_website',
            'phone',
            'search_city'
        ]);
        this.markers = [];
        this.markersOfCategory = [];

        this.state = {
            timer: true,
            sidebarState: 'close',
            bounds: null,
            zoom: 6,
            center: {
                lat: 43.4064296,
                lng: 13.0616715
            },
            markers: [] // array of objects of markers
        };
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, dispatch, frameActionCreators } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        // Frame actions
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => this.dispatchActions(app, this.afterLoaderActions, dispatch))
                .catch(reasons => console.warn(reasons));
        }
    }

    componentDidMount() {
        super.componentDidMount();

        //
        // FATCHING DATA FROM API
        // ----------------------
        http(API_STORES)
            .get()
            .then(response => {
                this.stores = JSON.parse(response).map(store => ({
                    idCategory: store.idCategory,
                    idStore: store.idStore,
                    title: store.title,
                    description: store.description,
                    phone: store.phone,
                    website: store.website,
                    position: __CLIENT__ ? new google.maps.LatLng(store.lat, store.lon) : null,
                    showInfo: false
                }));

                this.markersOfCategory = this.stores.filter(store => store.idCategory === this.category.idCategory);

                this.setState({
                    markers: this.stores
                });
            });
    }

    componentWillUpdate(nextProps) {
        super.componentWillUpdate(nextProps);

        // if (nextProps.params.slugCategory !== this.props.params.slugCategory) {
        //     this.category = this.props.categories.find(c => c.slug === nextProps.params.slugCategory);
        //     if (!this.category) {
        //         this.category = this.props.categories[0];
        //     }
        //     this.categoryIndex = this.props.categories.findIndex(c => c.slug === nextProps.params.slugCategory);
        //
        //     // Reset Markers
        //     this.markersOfCategory = this.stores.filter(store => store.idCategory === this.category.idCategory);
        //
        //     this.setState({
        //         timer: false
        //     }, () => {
        //         console.log('ora rivisualizzo');
        //         this.handleBoundsChanged();
        //         google.maps.event.trigger(this.map, 'resize');
        //         this.setState({
        //             timer: true
        //         });
        //     });
        // }
    }

    handleMarkerClick(marker) {
        this.state.markers.map(m => {
            if (m.showInfo) {
                this.handleMarkerClose(m);
            }
        });
        marker.showInfo = true;
        this.setState(this.state);
    }

    handleMarkerClose(marker) {
        marker.showInfo = false;
        this.setState(this.state);
    }

    handleBoundsChanged() {
        const { markers } = this.state;
        const currentBound = this.map.getBounds();
        const visibleMarkers = [];

        for (let i = 0, l = markers.length; i < l; i++) {
            if (currentBound.contains(markers[i].position)) {
                visibleMarkers.push(markers[i]);
            }
        }
        this.markers = visibleMarkers;

        this.setState({
            zoom: this.map.getZoom(),
            bounds: this.map.getBounds(),
            center: this.map.getCenter()
        });
    }

    handlePlacesChanged() {
        const places = this.refs.searchBox.getPlaces();
        const markers = [];

        // Add a marker for each place returned from search bar
        places.forEach(function (place) {
            markers.push({
                position: place.geometry.location
            });
        });

        // Set markers; set map center to first search result
        const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

        this.setState({
            center: mapCenter
        });
        this.map.props.map.setZoom(12);
    }

    handleSidebarToggle() {
        if (this.state.sidebarState === 'open') {
            this.setState({
                sidebarState: 'close'
            });
        }
        if (this.state.sidebarState === 'close') {
            this.setState({
                sidebarState: 'open'
            });
        }
    }

    renderInfoWindow(ref, marker) {
        const innerInfo = this.markersOfCategory.find(store => store.idStore === marker.idStore);
        const markerTitle = innerInfo ? innerInfo.title : '';
        const markerDesc = innerInfo ? innerInfo.description : '';
        const markerPhone = innerInfo.phone;
        const markerWebsite = innerInfo.website;
        const markerLink = `http://maps.google.com/maps?q=${markerTitle}&z=7`;

        return (

            //You can nest components inside of InfoWindow!
            <InfoWindow
                key={`${ref}_info_window`}
                onCloseclick={this.handleMarkerClose.bind(this, marker)} >

                <div className="c-info-window">
                    <h2>{markerTitle}</h2>
                    <div dangerouslySetInnerHTML={{__html: markerDesc}} />
                    <h3>{this.labels['phone']}</h3>
                    <div>{markerPhone}</div>
                    { markerWebsite.length > 0 && <a href={markerWebsite} target="_blank">Visit the website</a> }
                    <a href={markerLink} target="_blank" className="u-mt1">Open in Google Maps</a>
                </div>

            </InfoWindow>

        );

    }

    render() {
        const { app } = this.props;
        const { isMobile, isMoving, windowWidth, windowHeight } = app;

        const inputStyle = {
            border: 0,
            backgroundColor: isMobile ? 'rgba(250,250,250,1)' : 'rgba(250,250,250,0.9)',
            boxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            fontFamily: '\'acumin-pro\', sans-serif',
            fontSize: '9px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            outline: 'none',
            padding: '0 12px',
            width: '100%',
            height: '50px',
            textAlign: 'center',
            textOverflow: 'ellipses'
        };

        const sidebarModifier = this.state.sidebarState === 'open' ? 'is-open' : '';

        return (
            <div className="o-stores">
                <i className="o-ico o-ico--lens o-stores__lens"></i>
                <Sidebar
                    modifier={sidebarModifier}
                    isMoving={isMoving}
                    isMobile={isMobile}
                    sidebarState={this.state.sidebarState}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    onClickCB={this.handleSidebarToggle}
                >
                    {
                        this.markers.map((marker, index) => (
                            <div className="c-sidebar__store" key={index}>
                                <strong>
                                    <i className="o-ico o-ico--pin"></i>
                                    <a href="#" onClick={this.handleMarkerClick.bind(this, marker)}>{ marker.title }</a>
                                </strong>
                                <div dangerouslySetInnerHTML={{__html: marker.description}} />
                                <p>Phone: {marker.phone}</p>
                                <p><a href={marker.website} target="_blank">{ this.labels['view_website'] }</a></p>
                                <p><a href={`http://maps.google.com/maps?q=${marker.title}&z=7`} target="_blank" className="u-mt1">Open in Google Maps</a></p>
                            </div>
                        ))
                    }
                </Sidebar>
                <GoogleMapLoader
                    containerElement={ <div {...this.props} style={{ height: '100%' }} ></div> }
                    googleMapElement={
                        <GoogleMap
                            ref={map => { this.map = map; }}
                            center={this.state.center}
                            defaultOptions={{
                                zoom: this.state.zoom,
                                styles: googleMapsStyle,
                                disableDefaultUI: true
                            }}
                            onBoundsChanged={throttle(250, this.handleBoundsChanged)}
                            >
                            <SearchBox
                                controlPosition={__CLIENT__ ? google.maps.ControlPosition.TOP_LEFT : null}
                                onPlacesChanged={this.handlePlacesChanged}
                                ref="searchBox"
                                placeholder={this.labels['search_city']}
                                style={inputStyle}
                            />

                            {
                                this.state.timer &&
                                    <MarkerClusterer
                                        averageCenter
                                        enableRetinaIcons={false}
                                        gridSize={60}
                                        clusterClass="c-marker-cluster"
                                        imageSizes={[66, 66]}
                                        imageExtension="png"
                                        imagePath={`${global.pD}/assets/images/MarkerClusterer_${this.categoryIndex === 1 ? 'silver' : 'gold'}/`}
                                    >
                                        {
                                            this.markersOfCategory.map((marker, index) => (
                                                <Marker
                                                    key={index}
                                                    ref={`marker_${index}`}
                                                    icon={`/assets/images/marker_${this.categoryIndex === 1 ? 'silver' : 'gold'}.png`}
                                                    position={marker.position}
                                                    onClick={this.handleMarkerClick.bind(this, marker)}>
                                                    {marker.showInfo ? this.renderInfoWindow(`marker_${index}`, marker) : null}
                                                </Marker>
                                            ))
                                        }
                                    </MarkerClusterer>
                            }
                        </GoogleMap>
                    }
                />

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:image', 'content': this.storeLocatorImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
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
        hideFrameButton,
        showReservedAreaLink
    }
});

const mapStateToProps = (state) => ({
    app: state.app,
    categories: state.categories,
    pages: state.pages,
    stores: state.stores,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(StoresBomboniere);


/** WEBPACK FOOTER **
 ** ./containers/PageStoreLocator/page-StoresBomboniere.jsx
 **/
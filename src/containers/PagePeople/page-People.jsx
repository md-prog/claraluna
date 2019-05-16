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

// Components
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import DraggableWrapper from '../../components/DraggableWrapper/DraggableWrapper.jsx';
import DepartmentContainer from '../../components/People/DepartmentContainer.jsx';

class People extends PageContainer {

    constructor(props) {
        super(props);

        this.seoParams = this.getSeoParams('pages', props.pages.find(p => p.name === 'people'));
        this.peopleImage = global.pD + props.people[0].imageSrc;

        this.labels = getLabels(props.labels, ['drag_or_scroll']);

        this.state = {
            isFetching: false
        };
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

    getSnapArray(initialPoint, size = 300) {
        const { departments, people } = this.props;
        const elements = departments.concat(people);

        return elements.reduce((prev, curr, currIndex) => {
            let prevValue = prev[currIndex - 1];
            if (Number.isFinite(prevValue)) {
                prev.push(prevValue - size);
            } else {
                prev.push(initialPoint);
            }
            return prev;
        }, []);
    }


    render() {
        const { app, pages, departments, people } = this.props;
        const { isMoving, isMobile, isTablet, windowWidth } = app;
        const peoplePage = pages.find(p => p.name === 'people');
        // 10 = page columns
        // 4 = columns for each thumb
        const itemWidth = (isMobile || isTablet) ? windowWidth - 40 : Math.round(windowWidth / 10 * 4);
        const draggableWidth = (itemWidth * departments.length) + (itemWidth * people.length);
        const initialXPosition = Math.round((windowWidth / 2) - ((itemWidth) / 2));
        const snapArray = this.getSnapArray(0, itemWidth);

        return (
            <div className="o-people">

                <BackgroundImage src={`${global.pD || ''}${peoplePage.bgImage}`} />

                <DraggableWrapper
                    modifier="o-people__draggable"
                    isMoving={isMoving}
                    width={draggableWidth}
                    snapArray={snapArray}
                    initialXPosition={initialXPosition}
                >
                    {
                        departments.map((d, i) => {
                            const filteredPeople = people.filter(p => p.idDepartment === d.idDepartment);
                            return (<DepartmentContainer
                                {...d}
                                labels={this.labels}
                                people={filteredPeople}
                                itemWidth={itemWidth}
                                index={i}
                                key={i}
                            />);
                        })
                    }
                </DraggableWrapper>

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:image', 'content': this.peopleImage},
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
    people: state.people,
    departments: state.departments,
    pages: state.pages,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(People);


/** WEBPACK FOOTER **
 ** ./containers/PagePeople/page-People.jsx
 **/
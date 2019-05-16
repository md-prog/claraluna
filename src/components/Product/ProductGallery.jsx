import React from 'react';
import {batchActions} from 'redux-batched-actions';
import TransitionGroup from 'react-addons-transition-group';

// Utilities
import { bindFunctions, changeUrlParameter } from '../../utilities/utils';
import { getPicById } from '../../utilities/collections';

// Components
import Swipeable from 'react-swipeable';
import PureComponent from '../PureComponent.jsx';
import ProductGalleryItem from './ProductGalleryItem.jsx';
import Zoom from '../Zoom/Zoom.jsx';

class ProductGallery extends PureComponent {

    constructor(props) {
        super(props);

        const currentPic = (props.gallery.pics && props.gallery.pics.length > 0)
            ? getPicById(props.gallery.pics, props.gallery.pics[0].idPic)
            : null;

        const nextPic = getPicById(props.gallery.pics, currentPic.idPic + 1 > props.gallery.pics.length ? 0 : currentPic.idPic + 1);
        const prevPic = getPicById(props.gallery.pics, currentPic.idPic === 0 ? props.gallery.pics.length - 1 : currentPic.idPic - 1);

        this.state = {
            directionEnter: null,
            directionLeave: null,
            currentPic,
            prevPic,
            nextPic
        };

        this.state.currentPic = this.state.currentPic !== null
            ? Object.assign(this.state.currentPic, {
                thumb: this.state.currentPic ? changeUrlParameter(changeUrlParameter(this.state.currentPic.small, 'w', '200'), 'a.blur', '25') : '',
                loaded: false
            })
            : null;

        bindFunctions.call(this, ['onClickIndicator', 'mouseWheel']);
    }

    onClickIndicator(idPic) {
        return event => {
            event.preventDefault();

            const { appState, gallery } = this.props;
            const { isMoving } = appState;

            const direction = (idPic > this.state.currentPic.idPic) ? 'top' : 'bottom';

            if (!isMoving && idPic !== this.state.currentPic.idPic) {
                this.setState({
                    directionLeave: direction
                }, () => {
                    const currentPic = getPicById(gallery.pics, idPic);
                    const nextPic = getPicById(gallery.pics, currentPic.idPic + 1 >= gallery.pics.length ? 0 : currentPic.idPic + 1);
                    const prevPic = getPicById(gallery.pics, currentPic.idPic === 0 ? gallery.pics.length - 1 : currentPic.idPic - 1);

                    this.setState({
                        directionEnter: direction,
                        currentPic: Object.assign(currentPic, {
                            thumb: currentPic ? changeUrlParameter(changeUrlParameter(currentPic.small, 'w', '200'), 'a.blur', '25') : '',
                            loaded: false
                        }),
                        nextPic: Object.assign(nextPic, {
                            thumb: nextPic ? changeUrlParameter(changeUrlParameter(nextPic.small, 'w', '200'), 'a.blur', '25') : '',
                            loaded: false
                        }),
                        prevPic: Object.assign(prevPic, {
                            thumb: prevPic ? changeUrlParameter(changeUrlParameter(prevPic.small, 'w', '200'), 'a.blur', '25') : '',
                            loaded: false
                        })
                    });
                });
            }
        };
    }

    mouseWheel(event) {
        const { appState } = this.props;
        const { isZoomActive } = appState;

        if (!isZoomActive) {
            if (event.nativeEvent.deltaY > 0) {
                this.onClickIndicator(this.state.nextPic.idPic)(event);
            } else {
                this.onClickIndicator(this.state.prevPic.idPic)(event);
            }
        }
    }

    render() {
        const {
            gallery,
            appState,
            setMovingState,
            unsetMovingState,
            setFrameVisible,
            unsetFrameVisible,
            unsetIsZoomActive,
            openZoom,
            closeZoom
        } = this.props;
        const { isZoomActive, windowHeight, windowWidth } = appState;
        const { pics } = gallery;

        return (
            <div className="c-gallery" onWheel={this.mouseWheel}>

                <div className="c-gallery__reveal"></div>

                {
                    pics && pics.length > 1 && pics.map(p => {
                        const activeClass = (this.state.currentPic && p.idPic === this.state.currentPic.idPic) ? 'is-active' : '';

                        return (
                            <button type="button"
                                    className={`c-gallery__indicator ${activeClass}`}
                                    key={`indicator-${p.idPic}`}
                                    onClick={this.onClickIndicator(p.idPic)}>{p.idPic}</button>
                        );
                    })
                }

                <Swipeable onSwipingUp={this.onClickIndicator(this.state.nextPic.idPic)}
                           onSwipingDown={this.onClickIndicator(this.state.prevPic.idPic)}
                >
                    <TransitionGroup component="div" className="c-gallery__slides" onClick={openZoom}>
                        {
                            pics && pics.map(p => {
                                if (this.state.currentPic && p.idPic === this.state.currentPic.idPic) {
                                    return (
                                        <ProductGalleryItem
                                            key={this.state.currentPic.idPic}
                                            setMovingState={setMovingState}
                                            unsetMovingState={unsetMovingState}
                                            directionLeave={this.state.directionLeave}
                                            directionEnter={this.state.directionEnter}
                                            imageSmall={this.state.currentPic ? this.state.currentPic.small : ''}
                                            imageThumb={this.state.currentPic ? this.state.currentPic.thumb : ''}
                                        />
                                    );
                                }
                                return null;
                            })
                        }
                    </TransitionGroup>
                </Swipeable>

                <TransitionGroup className="c-zoom">
                    {
                        isZoomActive &&
                            <Zoom
                                image={this.state.currentPic ? this.state.currentPic.big : ''}
                                windowWidth={windowWidth}
                                windowHeight={windowHeight}
                                setFrameVisible={setFrameVisible}
                                unsetFrameVisible={unsetFrameVisible}
                                unsetIsZoomActive={unsetIsZoomActive}
                                closeZoom={closeZoom}
                            />
                    }
                </TransitionGroup>

            </div>
        );
    }
}

export default ProductGallery;



import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

import { TweenMax } from 'gsap';

import DraggableWrapper from '../DraggableWrapper/DraggableWrapper.jsx';
import AtelierHead from './AtelierHead.jsx';
import AtelierFooter from './AtelierFooter.jsx';
import AtelierThumb from './AtelierThumb.jsx';

class AtelierContainer extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    componentWillEnter(callback) {

        const { windowWidth } = this.props;

        if (__CLIENT__) {
            TweenMax.fromTo(this.el, 1, {
                opacity: 0,
                x: windowWidth
            }, {
                opacity: 1,
                x: 0,
                ease: Power3.easeOut,
                delay: 0.5,
                onComplete: callback
            });
        }

        if (__SERVER__) {
            callback();
        }
    }

    componentWillLeave(callback) {

        const { windowWidth, windowHeight, animationType } = this.props;

        if (__CLIENT__) {
            if (animationType === 'left') {
                TweenMax.set(this.el, { position: 'absolute', top: 0, y: (windowHeight / 100 * 15)});
                TweenMax.to(this.el, 1.2, {
                    x: windowWidth * -1,
                    opacity: 0,
                    ease: Power3.easeInOut,
                    onComplete: callback
                });
            } else {
                TweenMax.to(this.el, 0.7, {
                    x: windowWidth,
                    opacity: 0,
                    ease: Power3.easeIn,
                    onComplete: callback
                });
            }
        }

        if (__SERVER__) {
            callback();
        }

    }

    render() {
        const {
            isMoving,
            draggable,
            clickBackButton,
            clickNextButton,
            pics,
            itemWidth,
            currentCity,
            nextCity,
            labels
        } = this.props;
        const { initialXPosition, snapArray, draggableWidth } = draggable;
        const { city, addresses } = currentCity;
        const address = addresses.length > 0 && addresses[0].address;
        const phone = addresses.length > 0 && addresses[0].phone;

        return (
            <div className="o-atelier-container">
                <DraggableWrapper
                    modifier="o-atelier__draggable"
                    isMoving={isMoving}
                    width={draggableWidth}
                    snapArray={snapArray}
                    initialXPosition={initialXPosition}
                >
                    <AtelierHead
                        labels={labels}
                        isMoving={isMoving}
                        clickBackButton={clickBackButton}
                        itemWidth={itemWidth}
                        city={city}
                        address={address}
                        phone={phone}
                    />
                    {
                        pics.map(p =>
                            <AtelierThumb key={Math.random()} imageSrc={p.imageSrc} width={itemWidth * p.width} />
                        )
                    }
                    <AtelierFooter
                        labels={labels}
                        isMoving={isMoving}
                        itemWidth={itemWidth}
                        nextCity={nextCity}
                        clickBackButton={clickBackButton}
                        clickNextButton={clickNextButton}
                    />
                </DraggableWrapper>
            </div>
        );
    }
}

AtelierContainer.propTypes = {
    pics: React.PropTypes.array.isRequired,
    itemWidth: React.PropTypes.number.isRequired,
    clickBackButton: React.PropTypes.func.isRequired,
    nextCity: React.PropTypes.object.isRequired
};

export default AtelierContainer;


/** WEBPACK FOOTER **
 ** ./components/Atelier/AtelierContainer.jsx
 **/
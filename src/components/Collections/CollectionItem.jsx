import React from 'react';
import PureComponent from '../PureComponent.jsx';
import TransitionGroup from 'react-addons-transition-group';
import { findDOMNode } from 'react-dom';


// Components
import {TweenMax, TimelineMax} from 'gsap';
import SplitText from '../../vendor/gsap/utils/SplitText';
import Swipeable from 'react-swipeable';
import BackgroundImage from '../BackgroundImage/BackgroundImage.jsx';
import SingleCollection from './SingleCollection.jsx';
import CollectionName from './CollectionName.jsx';
import CollectionDesktopActions from './CollectionDesktopActions.jsx';
import Trigger from '../Buttons/Trigger.jsx';

class CollectionItem extends PureComponent {

    componentDidMount() {
        const { appState } = this.props;
        const { isMobile } = appState;

        this.getDOMReferences();

        if (! isMobile) {
            this.splitText = new SplitText(this.headline, {
                type: 'lines,words,chars',
                lineClass: 'js-collection__line',
                charsClass: 'js-collection__letters'
            });
            this.splitText.lines.forEach(line => {
                const underline = document.createElement('u');
                line.appendChild(underline);
            });
        }

        this.underline = this.el.querySelectorAll('.c-collections__name u');

        if (this.openCollectionTrigger) {
            TweenMax.fromTo(this.openCollectionTrigger, 0.5, { y: -40, opacity: 0 }, { y: 0, opacity: 1 });
        }
    }

    componentWillEnter(callback) {
        const { setMovingState, unsetMovingState, direction, appState } = this.props;
        const { isMobile, windowHeight } = appState;
        const chars = isMobile ? [] : this.splitText.chars;

        const done = () => {
            unsetMovingState();
            callback();
        };

        this.direction = direction;

        const anInTimeline = new TimelineMax({ onComplete: done });

        setMovingState();

        switch (direction) {
        case 'left':
            if (isMobile) {
                anInTimeline
                    .set(this.el, { position: 'absolute', zIndex: 11 })
                    .set(this.mobileCover, { transformOrigin: '50% 100%' })
                    .set(this.headline, { opacity: 0 })
                    .fromTo(this.el, 0.5, { opacity: 0 }, { opacity: 1 })
                    .fromTo(this.mobileCover, 1, { x: '20%', rotation: 10, opacity: 0 }, { x: '0%', rotation: 0, opacity: 1 })
                    .insert(TweenMax.to(this.headline, 0.5, { opacity: 1 }), 1);
            } else {
                anInTimeline
                    .set(chars, { y: '100%' })
                    .set(this.underline, { scaleX: 0 })
                    .set(this.openCollectionTrigger, { opacity: 0 })
                    .set(this.closeCollectionTrigger, { autoAlpha: 0 })
                    .set(this.el, { position: 'relative', height: windowHeight, zIndex: 11 })
                    .fromTo(this.el, 1.6, { x: '100%' }, { x: '0%', ease: Expo.easeInOut, onComplete: () => {
                        TweenMax.set(this.el, { clearProps: 'position, transform, zIndex, height' });
                    }})
                    .insert(TweenMax.fromTo(this.cover, 1.6, { x: '-50%'}, {x: '0%', ease: Expo.easeInOut, onComplete: () => {
                        TweenMax.set(this.cover, { clearProps: 'position, transform, zIndex, height' });
                    } }), 0)
                    .insert(TweenMax.staggerTo(chars, 0.9, { y: '0%', ease: Power3.easeInOut }, 0.02), 0.6)
                    .insert(TweenMax.staggerTo(this.underline, 1, { scaleX: 1, ease: Power3.easeInOut }, 0.2), 0.9)
                    .insert(TweenMax.to(this.openCollectionTrigger, 0.9, { opacity: 1 }), 0.8);
            }
            break;

        case 'right':
            if (isMobile) {
                anInTimeline
                    .set(this.el, { position: 'absolute', zIndex: 11 })
                    .set(this.mobileCover, { transformOrigin: '50% 100%' })
                    .set(this.headline, { opacity: 0 })
                    .fromTo(this.el, 0.5, { opacity: 0 }, { opacity: 1 })
                    .fromTo(this.mobileCover, 1, { x: '-20%', rotation: -10, opacity: 0 }, { x: '0%', rotation: 0, opacity: 1 })
                    .insert(TweenMax.to(this.headline, 0.5, { opacity: 1 }), 1);
            } else {
                anInTimeline
                    .set(chars, { y: '100%' })
                    .set(this.underline, { scaleX: 0 })
                    .set(this.openCollectionTrigger, { opacity: 0 })
                    .set(this.closeCollectionTrigger, { autoAlpha: 0 })
                    .set(this.el, { position: 'relative', height: windowHeight, zIndex: 11 })
                    .fromTo(this.el, 1.6, { x: '-100%' }, { x: '0%', ease: Expo.easeInOut, onComplete: () => {
                        TweenMax.set(this.el, { clearProps: 'position, transform, zIndex, height' });
                    } })
                    .insert(TweenMax.fromTo(this.cover, 1.6, { x: '50%'}, {x: '0%', ease: Expo.easeInOut, onComplete: () => {
                        TweenMax.set(this.cover, { clearProps: 'position, transform, zIndex, height' });
                    } }), 0)
                    .insert(TweenMax.staggerTo(chars, 0.9, { y: '0%', ease: Power3.easeInOut }, 0.02), 0.6)
                    .insert(TweenMax.staggerTo(this.underline, 1, { scaleX: 1, ease: Power3.easeInOut }, 0.2), 0.9)
                    .insert(TweenMax.to(this.openCollectionTrigger, 0.9, { opacity: 1 }), 0.8);
            }
            break;

        default:
            unsetMovingState();
        }

    }

    componentWillLeave(callback) {
        const { direction, appState } = this.props;
        const { isMobile } = appState;

        switch (direction) {
        case 'left':
            if (isMobile) {
                TweenMax.fromTo(this.el, 1, { opacity: 1 }, { opacity: 0, ease: Expo.easeInOut, onComplete: callback });
            } else {
                TweenMax.fromTo(this.el, 1.6, { x: '0%' }, { x: '-20%', ease: Expo.easeInOut, onComplete: callback });
            }
            break;

        case 'right':
            if (isMobile) {
                TweenMax.fromTo(this.el, 1, { opacity: 1 }, { opacity: 0, ease: Expo.easeInOut, onComplete: callback });
            } else {
                TweenMax.fromTo(this.el, 1.6, { x: '0%' }, { x: '20%', ease: Expo.easeInOut, onComplete: callback });
            }
            break;

        default:
            callback();
        }
    }

    render() {
        const {
            appState,
            collection,
            href,
            products,
            onClickTrigger,
            onWheelCollection,
            onMouseEnterTheCover,
            onMouseLeaveTheCover,
            onProductClick,
            onSwipeRight,
            onSwipeLeft,
            onSwipeUp,
            setProductVisibility,
            unsetProductVisibility,
            labels
        } = this.props;

        const { isCollectionOpen, isMobile, isTablet, isMoving, collectionOpenY, frameButtonState } = appState;

        const { name, intro, imageSrc } = collection;

        const coverStyle = {
            backgroundImage: `url(${global.pD || ''}${imageSrc})`,
            opacity: isMobile ? 0.05 : 1,
            cursor: isCollectionOpen ? 'pointer' : 'auto'
        };

        const mobCoverStyle = {
            backgroundImage: `url(${global.pD || ''}${imageSrc})`
        };

        return (
            <div className="c-collections__item" onWheel={onWheelCollection}>

                <BackgroundImage src={`${global.pD || ''}${imageSrc}`} />

                <Swipeable className="c-collections__head"
                    onMouseEnter={onMouseEnterTheCover}
                    onMouseLeave={onMouseLeaveTheCover}
                    onSwipingLeft={onSwipeLeft}
                    onSwipingRight={onSwipeRight}
                    onSwipingUp={onSwipeUp}
                >

                    <div className="c-collections__cover"
                         style={coverStyle}
                         onClick={isCollectionOpen ? onClickTrigger : null}
                    />

                    <CollectionName
                        name={name}
                        onClickName={onClickTrigger}
                        href={href}
                    />

                    { isMobile && <div className="c-collections__mob-cover" style={mobCoverStyle} onClick={onClickTrigger} /> }

                    {
                        !isMobile && <CollectionDesktopActions
                            name={name}
                            onClickTrigger={onClickTrigger}
                            backLabel={labels['back_to_collections']}
                        />
                    }


                    {
                        isCollectionOpen && <Trigger
                            onClickTrigger={onClickTrigger}
                            modifier="c-trigger--close-col"
                            btnModifier="c-btn c-btn--lite">{ labels['back_to_collections']  }</Trigger>
                    }

                </Swipeable>

                <TransitionGroup>
                    {
                        isCollectionOpen &&
                            <SingleCollection
                                intro={intro}
                                imageSrc={imageSrc}
                                products={products}
                                isMobile={isMobile}
                                isTablet={isTablet}
                                isMoving={isMoving}
                                collectionOpenY={collectionOpenY}
                                href={href}
                                onProductClick={onProductClick}
                                setProductVisibility={setProductVisibility}
                                unsetProductVisibility={unsetProductVisibility}
                            />
                    }
                </TransitionGroup>
            </div>
        );
    }

    getDOMReferences() {
        this.el                     = findDOMNode(this);
        this.container              = this.el.querySelector('.c-collections__container');
        this.headEl                 = this.el.querySelector('.c-collections__head');
        this.openCollectionTrigger  = this.el.querySelector('.c-trigger--open-col');
        this.closeCollectionTrigger = this.el.querySelector('.c-trigger--close-col');
        this.letters                = Array.from(this.el.querySelectorAll('.js-collection__letters'));
        this.cover                  = this.el.querySelector('.c-collections__cover');
        this.headline               = this.el.querySelector('.c-collections__name > h1');
        // Mobile
        this.mobileCover            = this.el.querySelector('.c-collections__mob-cover');
    }


}

export default CollectionItem;



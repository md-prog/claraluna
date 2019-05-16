import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

// Utilities
import { bindFunctions, preloadImage } from '../../utilities/utils';

// Components
import { TweenMax, Expo } from 'gsap';

class Loader extends PureComponent {

    constructor(props) {
        super(props);

        const { categories, appState } = props;
        const { isMobile } = appState;

        bindFunctions.call(this, ['playLoader']);

        this.logoWidth = isMobile ? 150 : 300;

        this.preloadData = [
            `${global.pD}/assets/images/menu-hd.png`,
            `${global.pD}/assets/images/claraluna-menu.png`,
            `${global.pD}/assets/images/book-sprite.png`
        ];

        categories.map(c => this.preloadData.push(global.pD + c.imageSrc));
    }

    componentDidMount() {
        if (__CLIENT__) {

            this.el = findDOMNode(this);
            this.rect = this.el.querySelector('#rect-bg');
            this.svg = this.el.querySelector('.o-loader__svg');
            this.logoGroup = this.el.querySelector('.o-loader__group-logo');
            this.textLoading = this.el.querySelector('.o-loader__loading');
            this.rectOverlay = this.el.querySelector('#rect-overlay');

            this.loadingChars = new SplitText(this.textLoading, {
                type: 'chars',
                charsClass: 'js-loading__letters'
            });

            TweenMax.to([this.logoGroup, this.textLoading], 0.3, { display: 'block', autoAlpha: 1, onComplete: () => {
                TweenMax.staggerTo(this.loadingChars.chars, 0.5, { opacity: 0, repeat: 10, yoyo: true, repeatDelay: 0.7 }, 0.1);
            } });


            this.preloadImages(this.preloadData)
                .then(() => {
                    TweenMax.killTweensOf(this.loadingChars.chars);

                    TweenMax.to(this.rect, 1.7, {
                        x: '100%',
                        ease: Expo.easeInOut,
                        onComplete: this.playLoader
                    });

                    TweenMax.staggerTo(this.loadingChars.chars, 1, {
                        y: '-100%',
                        opacity: 0
                    }, 0.1);
                })
                .catch(() => console.warn('Preload images fails'));
        }
    }

    preloadImages(images) {
        return Promise.all(images.map(pic => preloadImage(pic)));
    }

    playLoader() {
        const { setAppLoaded } = this.props;

        const done = () => {
            TweenMax.set(this.el, { display: 'none' });
            setAppLoaded();
        };

        const tl = new TimelineMax({ onComplete: done });

        tl
            .to(this.rectOverlay, 1, {
                scaleX: 1,
                ease: Expo.easeIn
            })
            .set(this.rectOverlay, { transformOrigin: '0% 50%' })
            .set(this.svg, { display: 'none' })
            .to(this.rectOverlay, 0.7, {
                scaleX: 0,
                ease: Expo.easeOut
            });

    }

    render() {
        const { appState } = this.props;
        const { windowWidth, windowHeight } = appState;

        const imageTag = `<image class="image_1"
                        xlink:href="/assets/images/loader.jpg"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice" />`;
        const transform = appState.isMobile
            ? `translate(${ (windowWidth - (this.logoWidth / 2)) / 2} ${ (windowHeight - 33) / 2 }) scale(0.5 0.5)`
            : `translate(${ (windowWidth - this.logoWidth) / 2} ${ (windowHeight - 33) / 2 })`;

        return (
            <div className="o-loader">
                <svg width="100%" height="100%" className="o-loader__svg">
                    <defs>
                        <mask id="mask" x="0" y="0" width="100%" height="100%" >

                            <rect id="alpha" x="0" y="0" width="100%" height="100%" />

                            <g className="o-loader__group-logo" transform={transform}>
                                <path d="M16.9,30.1c-8.1,0-14-6.1-14-13.6C2.8,8,9.4,2.9,17.3,2.9c7.9,0,11.6,4.1,12.9,5.3l1.9-2.1 C30.4,4.3,26.4,0,17.3,0C9.1,0,0,5.6,0,16.5c0,11.3,9.4,16.5,16.9,16.5c8.7,0,13.8-4.9,15.4-6.4l-2-2.1 C28.8,25.8,24.4,30.1,16.9,30.1z"/>
                                <path d="M82.1,10.5L69.8,32.2h2.9l3.2-5.4h15l3.2,5.4h2.9L84.6,10.4L82.1,10.5L82.1,10.5z M77.4,24l5.9-10.6L89.3,24 H77.4z"/>
                                <polygon points="46.2,10.5 43.4,10.5 43.4,32.2 60.4,32.2 60.4,29.4 46.2,29.4"/>
                                <path d="M129.1,16.9c0-4.9-4.3-6.5-8.3-6.5h-13.5v21.8h2.9v-8.8h9.6l6.2,8.8h3.6l-6.4-9C125.5,23,129.1,21,129.1,16.9z M110.1,20.5v-7.2h10.6c2.4,0,5.4,0.4,5.4,3.6c0,2.9-2.6,3.6-5.4,3.6H110.1z"/>
                                <path d="M287.6,10.5h-2.4l-12.3,21.8h2.9l3.2-5.4h15l3.2,5.4h2.9L287.6,10.5z M280.5,24l5.9-10.6l5.9,10.6H280.5z"/>
                                <polygon points="258.9,28.2 243.8,10.5 240.9,10.5 240.9,32.2 243.8,32.2 243.8,14.4 258.9,32.2 261.8,32.2 261.8,10.5 258.9,10.5 	"/>
                                <polygon points="179.4,10.5 176.6,10.5 176.6,32.2 193.6,32.2 193.6,29.4 179.4,29.4"/>
                                <path d="M223.1,23.9c0,3.7-2,6.2-7.7,6.2s-7.7-2.4-7.7-6.2V10.5h-2.9v13.4c0,7,5,9,10.5,9c5.5,0,10.5-2.1,10.5-9V10.5 H223L223.1,23.9L223.1,23.9z"/>
                                <path d="M151.8,10.5l-12.3,21.8h2.9l3.2-5.4h15l3.2,5.4h2.9l-12.3-21.8L151.8,10.5L151.8,10.5z M147.1,24l5.9-10.6 l5.9,10.6H147.1z"/>
                            </g>

                        </mask>
                    </defs>

                    <g dangerouslySetInnerHTML={{ __html: imageTag }} />
                    <rect id="rect-bg" x={`${(windowWidth - this.logoWidth) / 2}`} y={`${(windowHeight - 33) / 2}`} width={this.logoWidth} height="33" />
                    <rect id="base" mask="url(#mask)" x="0" y="0" width="100%" height="100%"/>

                </svg>

                <div id="rect-overlay"></div>
                <span className="o-loader__loading">Loading</span>
            </div>
        );
    }
}

export default Loader;


/** WEBPACK FOOTER **
 ** ./components/Loader/Loader.jsx
 **/
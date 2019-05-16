import React from 'react';
import PureComponent from '../PureComponent.jsx';

class ShareToggle extends PureComponent {

    openPopup(social) {

        let base = '';
        switch (social) {
        case 'facebook':
            base = 'https://www.facebook.com/sharer/sharer.php?u=';
            break;
        case 'twitter':
            base = 'https://twitter.com/home?status=';
            break;
        case 'pinterest':
            base = 'https://pinterest.com/pin/create/button/?url=';
            break;
        case 'google':
            base = 'https://plus.google.com/share?url=';
            break;
        default:
            base = 'https://www.facebook.com/sharer/sharer.php?u=';
        }

        return event => {
            event.preventDefault();

            const { href, appState, categoryName, productName } = this.props;
            const { windowWidth, windowHeight, isMobile } = appState;

            //
            // Analytics
            if (__CLIENT__) {
                window.dataLayer.push({
                    'event': 'GAevent',
                    'eventCategory': categoryName,
                    'eventAction': productName,
                    'eventLabel': 'share'
                });
            }

            if (isMobile) {
                window.open(base + href, '_blank');
            } else {
                const x = (windowWidth - 485) / 2;
                const y = (windowHeight - 700) / 2;
                window.open(base + href, 'Share', 'height=485,width=700,left=' + x + ',top=' + y);
            }
        };
    }

    render() {
        const { toggleShareButtons, shareState, appState } = this.props;
        const { isMobile } = appState;
        const openClass = shareState === 0 ? '' : 'is-open';

        return (
            <div className="c-share-buttons" onMouseEnter={toggleShareButtons} onMouseLeave={toggleShareButtons} onClick={isMobile ? toggleShareButtons : null}>
                <button className={`c-share-buttons__button ${openClass}`} type="button">
                    <i className="o-ico o-ico--share"></i>
                </button>
                <div className={`c-share-buttons__inner ${openClass}`}>
                    <ul className="c-share-buttons__list">
                        <li><a href="#" onClick={this.openPopup('facebook').bind(this)} className="c-share-buttons__button"><i className="o-ico o-ico--facebook"></i></a></li>
                        <li><a href="#" onClick={this.openPopup('google').bind(this)} className="c-share-buttons__button"><i className="o-ico o-ico--google-plus"></i></a></li>
                        <li><a href="#" onClick={this.openPopup('twitter').bind(this)} className="c-share-buttons__button"><i className="o-ico o-ico--twitter"></i></a></li>
                        <li><a href="#" onClick={this.openPopup('pinterest').bind(this)} className="c-share-buttons__button"><i className="o-ico o-ico--pinterest"></i></a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default ShareToggle;


/** WEBPACK FOOTER **
 ** ./components/Share/ShareButtons.jsx
 **/
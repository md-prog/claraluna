import React from 'react';
import { Link, browserHistory } from 'react-router';
import PureComponent from '../PureComponent.jsx';

class CookieLaw extends PureComponent {

    render() {
        const {isCookieEnabled, text, labelAccept, labelCookiePolicy, onAcceptCookieLaw} = this.props;

        return (
            <div className={`o-cookie-bar ${isCookieEnabled ? 'is-visible' : ''}`}>
                <div className="o-cookie-bar__content">
                    <p className="o-cookie-bar__text">{text}</p>
                    <div className="o-cookie-bar__accept-outer">
                        <Link to="/privacy">{labelCookiePolicy}</Link>
                        <button id="accept-cookie" className="cookie-bar__accept-button" onClick={onAcceptCookieLaw}>{labelAccept}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CookieLaw;



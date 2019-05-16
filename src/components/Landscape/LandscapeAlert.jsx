import React from 'react';
import PureComponent from '../PureComponent.jsx';

class LandscapeAlert extends PureComponent {

    render() {
        const { labels, isLandscape } = this.props;

        return (
            <div className={`o-landscape-alert ${isLandscape ? 'is-landscape' : ''}`}>
                <div className="o-landscape-alert__inner">
                    <i className="o-ico o-ico--rotate"></i><br />
                    <br/>
                    <span>{ labels['rotate_device'] }</span>
                </div>
            </div>
        );
    }
}

export default LandscapeAlert;


/** WEBPACK FOOTER **
 ** ./components/Landscape/LandscapeAlert.jsx
 **/
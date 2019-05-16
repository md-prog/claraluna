import React from 'react';
import PureComponent from '../PureComponent.jsx';

class AtelierThumb extends PureComponent {

    render() {
        const {imageSrc, width} = this.props;

        const thumbStyle = {
            width: `${width}px`
        };

        const thumbCoverStyle = {
            backgroundImage: `url(${global.pD || ''}${imageSrc})`
        };

        return (
            <div className="c-thumb c-thumb--atelier" style={thumbStyle}>
                <div className="c-thumb__cover-container c-thumb__cover-container--atelier">
                    <div className="c-thumb__cover c-thumb__cover--atelier" style={thumbCoverStyle}></div>
                </div>
            </div>
        );
    }
}

export default AtelierThumb;


/** WEBPACK FOOTER **
 ** ./components/Atelier/AtelierThumb.jsx
 **/
import React from 'react';
import PureComponent from '../PureComponent.jsx';

// Utilities
import { changeUrlParameter } from '../../utilities/utils';

class BackgroundImage extends PureComponent {
    render() {
        const { src } = this.props;
        const style = {
            backgroundImage: `url(${changeUrlParameter(src, 's.grayscale', 'true')})`
        };
        return <div className="c-background" style={style}></div>;
    }
}

export default BackgroundImage;



/** WEBPACK FOOTER **
 ** ./components/BackgroundImage/BackgroundImage.jsx
 **/
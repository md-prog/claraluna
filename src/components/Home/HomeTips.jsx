import React from 'react';
import PureComponent from '../PureComponent.jsx';

class HomeTips extends PureComponent {

    render() {
        const { children } = this.props;
        return <p className="u-text--geometric">{children}</p>;
    }
}

export default HomeTips;


/** WEBPACK FOOTER **
 ** ./components/Home/HomeTips.jsx
 **/
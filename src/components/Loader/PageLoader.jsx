import React from 'react';
import PureComponent from '../PureComponent.jsx';

import {bindFunctions} from '../../utilities/utils';

class PageLoader extends PureComponent {

    constructor(props) {
        super(props);
        bindFunctions.call(this, ['getStatusClassName']);
    }

    getStatusClassName(pageLoaderState) {
        const statusClassName = {
            [0]: 'is-close',
            [1]: 'is-entering',
            [2]: 'is-leaving'
        };
        return statusClassName[pageLoaderState] ? statusClassName[pageLoaderState] : '';
    }

    render() {
        const { pageLoaderState } = this.props;
        const modifier = this.getStatusClassName(pageLoaderState);
        return <div className={`o-page-loader ${modifier}`} />;
    }
}

export default PageLoader;


/** WEBPACK FOOTER **
 ** ./components/Loader/PageLoader.jsx
 **/
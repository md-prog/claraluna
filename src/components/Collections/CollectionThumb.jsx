import React from 'react';
import PureComponent from '../PureComponent.jsx';

import { bindFunctions } from '../../utilities/utils';

class CollectionThumb extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['clickHandler']);
    }

    clickHandler(event) {
        const { onCollectionClick, href } = this.props;
        onCollectionClick.call(this, event, href);
    }

    render() {

        const { name, image } = this.props;

        const thumbStyle = {
            backgroundImage: `url(${global.pD || ''}${image})`
        };

        return (
            <a className="c-thumb c-thumb--archive" onClick={this.clickHandler}>
                <div className="c-thumb__cover-container">
                    <div className="c-thumb__cover c-thumb__cover--archive" style={thumbStyle}></div>
                </div>
                <h3 className="c-thumb__caption c-thumb__caption--archive">{name}</h3>
            </a>
        );
    }
}

export default CollectionThumb;



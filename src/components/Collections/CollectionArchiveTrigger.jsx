import React from 'react';
import PureComponent from '../PureComponent.jsx';

import Trigger from '../Buttons/Trigger.jsx';

class CollectionArchiveTrigger extends PureComponent {

    render() {
        const { viewAllCollectionState, onClickTrigger, label } = this.props;
        return (
            <Trigger
                modifier="c-trigger--collections"
                btnModifier={`c-btn c-btn--collections ${viewAllCollectionState > 0 ? 'is-visible' : ''}`}
                onClickTrigger={onClickTrigger}
            >{label}</Trigger>
        );
    }
}

export default CollectionArchiveTrigger;


/** WEBPACK FOOTER **
 ** ./components/Collections/CollectionArchiveTrigger.jsx
 **/
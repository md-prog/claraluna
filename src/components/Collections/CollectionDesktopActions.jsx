import React from 'react';
import PureComponent from '../PureComponent.jsx';

import Trigger from '../Buttons/Trigger.jsx';

class CollectionDesktopActions extends PureComponent {

    render() {

        const { name, onClickTrigger, backLabel } = this.props;

        return (
            <div className="c-collections__triggers">
                <Trigger
                    onClickTrigger={onClickTrigger}
                    modifier="c-trigger--open-col"
                    btnModifier="c-btn c-btn--lite">
                    {name}
                </Trigger>
                <Trigger
                    onClickTrigger={onClickTrigger}
                    modifier="c-trigger--close-col"
                    btnModifier="c-btn c-btn--lite">
                    {backLabel}
                </Trigger>
            </div>
        );
    }
}

export default CollectionDesktopActions;



/** WEBPACK FOOTER **
 ** ./components/Collections/CollectionDesktopActions.jsx
 **/
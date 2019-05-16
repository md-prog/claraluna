import React from 'react';
import PureComponent from '../PureComponent.jsx';

import Trigger from '../Buttons/Trigger.jsx';

class MenuTrigger extends PureComponent {

    getMenuTriggerModifier(isMenuOpen) {

        const modifier = {
            [1]: 'is-visible is-menu-close',
            [2]: 'is-visible is-menu-closing',
            [3]: 'is-visible is-menu-open'
        };

        return modifier[isMenuOpen] ? modifier[isMenuOpen] : '';
    }

    render() {
        const { isMenuOpen, onClickTrigger } = this.props;
        const triggerModifier = this.getMenuTriggerModifier(isMenuOpen);

        return (
            <Trigger
                modifier={`c-trigger--menu ${triggerModifier}`}
                btnModifier={`c-btn c-btn--menu ${isMenuOpen > 0 ? 'is-visible' : ''}`}
                onClickTrigger={onClickTrigger}
            >
                <span className="o-menu__label o-menu__label--menu">Menu</span>
                <span className="o-menu__label o-menu__label--close">Close</span>
            </Trigger>
        );
    }
}

export default MenuTrigger;



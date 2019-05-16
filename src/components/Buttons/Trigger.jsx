import React from 'react';
import PureComponent from '../PureComponent.jsx';

class Trigger extends PureComponent {

    render() {
        const { disabled, onClickTrigger, modifier, btnModifier, children } = this.props;
        return (
            <div className={`c-trigger ${ modifier ? modifier : '' }`}>
                <button
                    disabled={disabled}
                    className={ btnModifier ? btnModifier : '' }
                    onClick={ onClickTrigger }>
                    { children }
                </button>
            </div>
        );
    }
}

export default Trigger;



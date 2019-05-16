import React from 'react';
import PureComponent from '../PureComponent.jsx';

class CircleIcon extends PureComponent {
    render() {

        const {modifier, icon, onClickCB, isMoving } = this.props;

        return (
            <button className={`c-circle ${modifier}`} type="button" onClick={onClickCB} disabled={isMoving}>
                <i className={`o-ico ${icon}`}></i>
            </button>
        );
    }
}

export default CircleIcon;


/** WEBPACK FOOTER **
 ** ./components/Buttons/CircleIcon.jsx
 **/
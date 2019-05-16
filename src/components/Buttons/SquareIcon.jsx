import React from 'react';
import PureComponent from '../PureComponent.jsx';

class SquareIcon extends PureComponent {
    render() {

        const { modifier, icon, onClickCB, isMoving, style } = this.props;
        const propStyle = style ? style : {};

        return (
            <button className={`c-square ${modifier}`} type="button" onClick={onClickCB} disabled={isMoving} style={propStyle}>
                <i className={`o-ico ${icon}`}></i>
            </button>
        );
    }
}

export default SquareIcon;



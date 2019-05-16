import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

// Components
import { TweenMax } from 'gsap';
import SquareIcon from '../Buttons/SquareIcon.jsx';


class Sidebar extends PureComponent {

    render() {
        const { isMobile, isMoving, modifier, children, windowWidth, sidebarState, onClickCB } = this.props;

        return (
            <div className={`c-sidebar ${modifier}`}>
                <SquareIcon
                    modifier="t-white-transparent c-square--sidebar"
                    icon="o-ico--arrow-right"
                    onClickCB={onClickCB}
                    isMoving={isMoving}
                />
                <div className="c-sidebar__inner">{children}</div>
            </div>
        );
    }
}

export default Sidebar;


/** WEBPACK FOOTER **
 ** ./components/Sidebar/Sidebar.jsx
 **/
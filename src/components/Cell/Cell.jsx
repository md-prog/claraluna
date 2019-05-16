import React from 'react';
import PureComponent from '../PureComponent.jsx';

class Cell extends PureComponent {

    render() {
        const { modifier, children } = this.props;
        return (
            <div className={`o-cell ${modifier}`}>
                <div className="o-cell__inner">
                    { children }
                </div>
            </div>
        );
    }
}

export default Cell;


/** WEBPACK FOOTER **
 ** ./components/Cell/Cell.jsx
 **/
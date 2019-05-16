import React from 'react';
import PureComponent from '../PureComponent.jsx';

class Counter extends PureComponent {
    render() {

        const { current, amount } = this.props;

        return (
            <div className="c-counter">
                <span className="c-counter__current">{ current }</span>
                <span className="c-counter__amount">{ amount }</span>
            </div>
        );
    }
}

export default Counter;


/** WEBPACK FOOTER **
 ** ./components/Counter/Counter.jsx
 **/
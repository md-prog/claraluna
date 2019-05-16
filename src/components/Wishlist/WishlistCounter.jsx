import React from 'react';
import PureComponent from '../PureComponent.jsx';

class WishlistCounter extends PureComponent {

    render() {
        const { counter } = this.props;
        return (
            <div className="o-wishlist__counter">
                <i className="o-ico o-ico--heart-fill"></i>
                <span>{`${(counter < 10) ? '0' : ''}${counter}`}</span>
            </div>
        );
    }
}

export default WishlistCounter;



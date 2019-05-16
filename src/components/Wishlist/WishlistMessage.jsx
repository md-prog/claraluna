import React from 'react';
import PureComponent from '../PureComponent.jsx';

class WishlistMessage extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div className="o-wishlist__message">
                <div className="o-wishlist__message-inner">
                    { children }
                </div>
            </div>
        );
    }
}

export default WishlistMessage;



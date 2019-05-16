import React from 'react';
import PureComponent from '../PureComponent.jsx';

class WishlistTitle extends PureComponent {

    render() {
        return (
            <div className="o-wishlist__title u-text--geometric">{this.props.title}</div>
        );
    }
}

export default WishlistTitle;


/** WEBPACK FOOTER **
 ** ./components/Wishlist/WishlistTitle.jsx
 **/
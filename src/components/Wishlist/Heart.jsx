import React from 'react';
import PureComponent from '../PureComponent.jsx';

class Heart extends PureComponent {

    render() {
        const { clickCallback, inWishlist, shareState } = this.props;
        const heartState = shareState === 1 ? 'is-hide' : '';

        return (
            <a href="#" className={`c-heart ${heartState}`} onClick={clickCallback}>
                { inWishlist && <i className="o-ico o-ico--heart-fill"></i> }
                { ! inWishlist && <i className="o-ico o-ico--heart"></i> }
            </a>
        );
    }
}

export default Heart;


/** WEBPACK FOOTER **
 ** ./components/Wishlist/Heart.jsx
 **/
import React from 'react';
import { Link } from 'react-router';
import PureComponent from '../PureComponent.jsx';

class WishlistThumb extends PureComponent {

    render() {
        const { idProduct, isMobile, imageSrc, name, href, categoryName, removeFromWishlist, clickProductThumb } = this.props;

        const thumbStyle = {
            backgroundImage: isMobile ? '' : `url(${global.pD || ''}${imageSrc})`
        };

        return (
            <div className="c-thumb c-thumb--wishlist">
                { isMobile && <img src={(global.pD || '') + imageSrc} alt={name} /> }
                <div className="c-thumb__reveal"></div>
                <Link to={href} onClick={clickProductThumb(href)} className="c-thumb__cover c-thumb__cover--wishlist" style={thumbStyle}>
                    <div className="c-thumb__icon c-thumb__icon--wishlist"><i className="o-ico o-ico--eye"></i></div>
                </Link>
                <div className="c-thumb__caption c-thumb__caption--wishlist">
                    <span>{name}</span>
                    <span className="u-text--title">{categoryName}</span>
                    <button className="o-whishlist__remove" type="button" onClick={removeFromWishlist(idProduct).bind(this)}><i className="o-ico o-ico--heart-fill"></i></button>
                </div>
            </div>
        );
    }
}

WishlistThumb.propTypes = {
    removeFromWishlist: React.PropTypes.func.isRequired,
    idProduct: React.PropTypes.number.isRequired,
    name: React.PropTypes.string,
    imageSrc: React.PropTypes.string,
    categoryName: React.PropTypes.string,
    isMobile: React.PropTypes.bool.isRequired
};

export default WishlistThumb;


/** WEBPACK FOOTER **
 ** ./components/Wishlist/WishlistThumb.jsx
 **/
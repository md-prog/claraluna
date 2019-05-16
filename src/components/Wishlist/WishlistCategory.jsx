import React from 'react';
import PureComponent from '../PureComponent.jsx';

class WishlistCategory extends PureComponent {

    render() {
        const { name, counter } = this.props;
        return (
            <div className="o-wishlist__categories">
                <h2>
                    <span>{name}</span>
                    <sup className="u-text--geometric">{`${(counter < 10) ? '0' : ''}${counter}`}</sup>
                </h2>
            </div>
        );
    }
}

WishlistCategory.propsType = {
    name: React.PropTypes.string.isRequired,
    counter: React.PropTypes.number.isRequired
};

export default WishlistCategory;



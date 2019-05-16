import React from 'react';
import PureComponent from '../PureComponent.jsx';

import Cell from '../Cell/Cell.jsx';
import WishlistThumb from '../Wishlist/WishlistThumb.jsx';

import { bindFunctions } from '../../utilities/utils';

class WishlistGrid extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['getColumns']);
    }

    getColumns() {
        let leftCount = 0,
            rightCount = 0;
        const { isMobile, wishlistData, removeFromWishlist, categories, clickProductThumb } = this.props;
        const leftColumn = [];
        const rightColumn = [];

        wishlistData.map(prod => {
            const { idProduct, height } = prod;
            const cellHeight = height > 1 ? 'o-cell--tall' : '';

            const cell = (
                <Cell modifier={cellHeight} key={idProduct}>
                    <WishlistThumb
                        clickProductThumb={clickProductThumb}
                        categories={categories}
                        isMobile={isMobile}
                        removeFromWishlist={removeFromWishlist}
                        {...prod}
                    />
                </Cell>
            );

            if (rightCount >= leftCount) {
                leftColumn.push(cell);
                leftCount = leftCount + height;
            } else {
                rightColumn.push(cell);
                rightCount = rightCount + height;
            }
        });

        return [ leftColumn, rightColumn ];
    }

    render() {
        const columns = this.getColumns();

        return (
            <div className="o-container">
                <div className="o-col o-col--sx u-50@tablet u-mt3">
                    {columns[0]}
                </div>
                <div className="o-col o-col--sx u-50@tablet u-mt3">
                    {columns[1]}
                </div>
                <div className="u-clear"></div>
            </div>
        );
    }
}

WishlistGrid.propTypes = {
    removeFromWishlist: React.PropTypes.func.isRequired,
    wishlistData: React.PropTypes.array.isRequired,
    isMobile: React.PropTypes.bool
};


export default WishlistGrid;



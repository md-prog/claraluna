import React from 'react';
import PureComponent from '../PureComponent.jsx';

// Components
import CircleIconWithLabel from '../Buttons/CircleIconWithLabel.jsx';
import CircleIcon from '../Buttons/CircleIcon.jsx';
import Counter from '../Counter/Counter.jsx';

class ProductsNavi extends PureComponent {

    render() {
        const { counterCurrent, counterAmount, isMobile, isMoving, isDetailOpen, onViewAllClick, onPrevClick, onNextClick, onDetailOpen} = this.props;

        return (
            <div className="c-product__navi-grid">
                <CircleIconWithLabel
                    key="0"
                    wrapperModifier="c-circle-wrapper--view-all"
                    label="Indietro"
                    modifier={`c-circle--prod-navi c-circle--prod-view-all ${isDetailOpen ? 't-lite' : ''}`}
                    icon="o-ico--collection-page2"
                    isMoving={isMoving}
                    onClickCB={onViewAllClick}
                />
                { isMobile && <CircleIcon
                    key="1"
                    modifier={`c-circle--prod-navi c-circle--details t-big ${isDetailOpen ? 't-lite' : ''}`}
                    icon={isDetailOpen ? 'o-ico--close' : 'o-ico--burger'}
                    isMoving={isMoving}
                    onClickCB={onDetailOpen}
                /> }
                { ! isMobile && <CircleIcon
                    key="3"
                    modifier="c-circle--prod-navi c-circle--prod-prev"
                    icon="o-ico--arrow-left"
                    isMoving={isMoving}
                    onClickCB={onPrevClick}
                /> }
                { ! isMobile && <CircleIcon
                    key="4"
                    modifier="c-circle--prod-navi c-circle--prod-next"
                    icon="o-ico--arrow-right"
                    isMoving={isMoving}
                    onClickCB={onNextClick}
                /> }
                { ! isMobile && <Counter
                    current={counterCurrent}
                    amount={counterAmount}
                /> }
            </div>
        );
    }
}

export default ProductsNavi;



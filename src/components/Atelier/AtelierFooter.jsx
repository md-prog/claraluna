import React from 'react';
import PureComponent from '../PureComponent.jsx';

import CircleIcon from '../Buttons/CircleIcon.jsx';

class AtelierFooter extends PureComponent {

    constructor(props) {
        super(props);

        this.clickNextButton = props.clickNextButton.bind(this);
    }

    render() {
        const { isMoving, itemWidth, nextCity, clickBackButton, labels } = this.props;
        const { city } = nextCity;
        const footerStyle = {
            width: `${itemWidth}px`
        };

        return (
            <div className="o-atelier-container__head" style={footerStyle}>
                <CircleIcon
                    modifier="t-lite c-circle--atelier-next"
                    icon="o-ico--arrow-right"
                    onClickCB={this.clickNextButton(city)}
                    isMoving={isMoving}
                />
                <a className="o-atelier__label o-atelier__label--top" onClick={this.clickNextButton(city)}>{labels['next_atelier']}</a>
                <a className="o-atelier__city" onClick={this.clickNextButton(city)}>{city}</a>
                <a href="#" className="o-atelier__label o-atelier__label--bottom" onClick={clickBackButton}>{labels['back_to_overview']}</a>
            </div>
        );
    }
}

AtelierFooter.protoType = {
    itemWidth: React.PropTypes.number.isRequired
};

export default AtelierFooter;


/** WEBPACK FOOTER **
 ** ./components/Atelier/AtelierFooter.jsx
 **/
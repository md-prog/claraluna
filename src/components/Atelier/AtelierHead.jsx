import React from 'react';
import PureComponent from '../PureComponent.jsx';

import CircleIcon from '../Buttons/CircleIcon.jsx';

class AtelierHead extends PureComponent {

    render() {
        const {isMoving, itemWidth, city, address, phone, clickBackButton, labels} = this.props;

        const headStyle = {
            width: `${itemWidth}px`
        };

        return (
            <div className="o-atelier-container__head" style={headStyle}>
                <h2 className="o-atelier__label u-cursor-def">Atelier</h2>
                <CircleIcon
                    modifier="t-lite c-circle--atelier-back"
                    icon="o-ico--close"
                    onClickCB={clickBackButton}
                    isMoving={isMoving}
                />
                <h1 className="o-atelier__city">{city}</h1>
                <div className="o-atelier__address">
                    <h3 className="u-text--geometric">{labels['address']}</h3>
                    <address dangerouslySetInnerHTML={{__html: address}} />
                    <h3 className="u-text--geometric u-mt2">{labels['phone']}</h3>
                    <p className="u-text--important">{phone}</p>
                </div>
            </div>
        );
    }
}

AtelierHead.propTypes = {
    itemWidth: React.PropTypes.number.isRequired,
    city: React.PropTypes.string.isRequired,
    address: React.PropTypes.string.isRequired,
    phone: React.PropTypes.string.isRequired,
    clickBackButton: React.PropTypes.func.isRequired
};

export default AtelierHead;


/** WEBPACK FOOTER **
 ** ./components/Atelier/AtelierHead.jsx
 **/
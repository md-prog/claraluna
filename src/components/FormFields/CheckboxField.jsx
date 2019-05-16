import React from 'react';
import PureComponent from '../PureComponent.jsx';

class CheckboxField extends PureComponent {

    render() {

        const {id, theme, children} = this.props;

        return (
            <div className="o-form__inner">
                <div className={`c-check js-an ${theme ? theme : ''}`}>
                    <input className="c-check__input" type="checkbox" id={id} name={id} />
                    <label className="c-check__label" htmlFor={id}>{children}</label>
                </div>
            </div>
        );

    }
}

export default CheckboxField;


/** WEBPACK FOOTER **
 ** ./components/FormFields/CheckboxField.jsx
 **/
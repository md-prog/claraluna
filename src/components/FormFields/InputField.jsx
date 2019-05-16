import React from  'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import {bindFunctions} from '../../utilities/utils';

class InputField extends PureComponent {

    constructor() {
        super();

        this.state = {
            inputClass: ''
        };

        bindFunctions.call(this, ['focusHandler', 'blurHandler']);
    }

    componentDidMount() {
        this.el = findDOMNode(this);
        this.input = this.el.querySelector('input');
    }

    focusHandler() {
        this.setState({ inputClass: 'has-focus' });
    }

    blurHandler() {
        const { required, type } = this.props;

        if (this.input.value.length === 0) {
            this.setState({ inputClass: '' });
        } else if (required && type === 'text' && !this.validateField(this.input.value)) {
            this.setState({inputClass: 'has-error'});
        } else if (required && type === 'email' && !this.validateEmail(this.input.value)) {
            this.setState({inputClass: 'has-error'});
        } else {
            this.setState({ inputClass: 'has-focus' });
        }
    }

    validateField(value) {
        return value.length > 3;
    }

    validateEmail(value) {
        const pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(value);
    }


    render() {
        const { type, id, children, theme } = this.props;

        return (
            <div className={`o-form__inner js-an ${theme ? theme : ''} ${this.state.inputClass}`}>
                <span className="o-form__label o-form__label--small">{children}</span>
                <label htmlFor={id} className="o-form__label o-form__label--big">{children}</label>
                <input type={type} className="o-form__input" id={id} onFocus={this.focusHandler} onBlur={this.blurHandler} />
            </div>
        )
    }
}

export default InputField;


/** WEBPACK FOOTER **
 ** ./components/FormFields/InputField.jsx
 **/
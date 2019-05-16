import React from 'react';
import {findDOMNode} from 'react-dom';
import {bindFunctions} from '../../utilities/utils';
import PureComponent from '../PureComponent.jsx';

class TextareaField extends PureComponent {

    constructor() {
        super();

        this.state = {
            textareaClass: ''
        };

        bindFunctions.call(this, ['focusHandler', 'blurHandler']);
    }

    componentDidMount() {
        this.el = findDOMNode(this);
        this.textarea = this.el.querySelector('textarea');
    }

    focusHandler() {
        this.setState({ textareaClass: 'has-focus' });
    }

    blurHandler() {
        if (this.textarea.value.length === 0) {
            this.setState({ textareaClass: '' });
        }
    }

    render() {

        const {id, theme, children} = this.props;

        return (
            <div className={`o-form__inner js-an ${theme ? theme : ''} ${this.state.textareaClass}`}>
                <span className="o-form__label o-form__label--small">{children}</span>
                <label htmlFor={id} className="o-form__label o-form__label--big o-form__label--textarea">{children}</label>
                <textarea
                    name={id}
                    id={id}
                    className="o-form__input o-form__input--textarea"
                    onFocus={this.focusHandler}
                    onBlur={this.blurHandler}></textarea>
            </div>
        )
    }
}

export default TextareaField;


/** WEBPACK FOOTER **
 ** ./components/FormFields/TextareaField.jsx
 **/
import React from  'react';
import { findDOMNode } from 'react-dom';
import PureComponent from '../PureComponent.jsx';
import {bindFunctions} from '../../utilities/utils';

class SelectField extends PureComponent {

    constructor(props) {
        super(props);
        bindFunctions.call(this, ['toggle', 'selectItem']);

        this.state = {
            current: 0,
            hasFocus: '',
            isOpen: false,
            options: props.data
        };
    }

    componentDidMount() {
        this.el = findDOMNode(this);
        this.optionUl = this.el.querySelector('.c-select__options > ul');
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    selectItem(optionIndex) {
        const { options } = this.state;
        return e => {
            this.setState({
                hasFocus: 'has-focus',
                current: options[optionIndex].city.toLowerCase()
            });
        };
    }

    render() {
        const {id, placeholder, theme} = this.props;
        const {current, options, isOpen, hasFocus} = this.state;

        const optionStyle = {
            height: isOpen ? this.optionUl && this.optionUl.clientHeight : 0
        };

        const label = typeof current === 'number' ? placeholder : options.find(o => o.city.toLowerCase() === current).city;

        return (
            <div className="o-form__inner">
                <div className={`c-select js-an ${theme ? theme : ''} ${isOpen ? 'is-select-open' : ''} ${hasFocus}`} onClick={this.toggle}>

                    <em className="c-select__arrow"></em>

                    <div className="c-select__placeholder">{label}</div>

                    <div className="c-select__options" style={optionStyle}>
                        <ul>
                            { options.map((a, index) => <li key={index} onClick={this.selectItem(index)}>{a.city}</li>) }
                        </ul>
                    </div>

                    <select name={id} id={id} className="c-select__field" value={current}>
                        {/*<options value="Not specified">Not specified</options>*/}
                        { options.map((a, index) => <option key={index} value={a.city.toLowerCase()}>{a.city}</option> ) }
                    </select>
                </div>
            </div>
        );
    }
}

export default SelectField;



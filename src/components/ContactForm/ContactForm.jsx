import React from 'react';
import { Link, browserHistory } from 'react-router';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

// Utilities
import { bindFunctions } from '../../utilities/utils';

// Components
import { TweenMax } from 'gsap';
import InputField from '../FormFields/InputField.jsx';
import TextareaField from '../FormFields/TextareaField.jsx';
import CheckboxField from '../FormFields/CheckboxField.jsx';
import Trigger from '../Buttons/Trigger.jsx';

class BackgroundImage extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['clickPrivacy']);
    }
    componentDidMount() {
        this.el = findDOMNode(this);
        this.items = Array.from(this.el.querySelectorAll('.js-an'));
    }

    componentWillEnter(callback) {
        TweenMax.staggerFromTo(this.items, 0.7, { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.7, ease: Power3.easeOut }, 0.1, callback);
    }

    componentWillLeave(callback) {
        TweenMax.staggerTo(this.items.reverse(), 0.7, { y: 50, opacity: 0, ease: Power3.easeIn }, 0.05, callback);
    }

    clickPrivacy(event) {
        event.preventDefault();
        const { urlPrivacy, showPageLoader } = this.props;

        showPageLoader()
            .then(() => browserHistory.push(urlPrivacy))
            .catch((reason) => console.warn(reason));
    }

    render() {
        const { onSubmit, isFetching, labels, urlPrivacy } = this.props;

        return (
            <div className="o-form">
                <h3 className="o-contacts__title u-text--title js-an">{labels['send_us_email']}</h3>
                <InputField type="text" id="contacts-name" required={true}>* {labels['name']}</InputField>
                <InputField type="email" id="contacts-email" required={true}>* {labels['e_mail']}</InputField>
                <TextareaField id="contacts-notes" required={true}>* {labels['note']}</TextareaField>
                <div className="o-grid">
                    <div className="o-grid__item u-75@tablet">
                        &nbsp;
                        <CheckboxField id="contacts-privacy">{labels['accept_privacy']} <Link to={urlPrivacy} onClick={this.clickPrivacy}>{labels['privacy']}</Link></CheckboxField>
                    </div>
                    <div className="o-grid__item u-25@tablet">
                        <Trigger
                            disabled={isFetching}
                            onClickTrigger={onSubmit}
                            modifier="c-trigger--contacts js-an"
                            btnModifier="c-btn c-btn--default c-btn--block">{labels['send']}</Trigger>
                    </div>
                </div>
                <div className="u-clear"></div>
            </div>
        )
    }
}

export default BackgroundImage;



import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';
import { Link, browserHistory } from 'react-router';

// Utilities
import { bindFunctions } from '../../utilities/utils';

// Components
import { TweenMax } from 'gsap';
import InputField from '../FormFields/InputField.jsx';
import Trigger from '../Buttons/Trigger.jsx';
import CheckboxField from '../FormFields/CheckboxField.jsx';

class NewsletterForm extends PureComponent {
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

    render() {
        const { onSubmit, isFetching, labels, urlPrivacy } = this.props;

        return (
            <div className="o-form">
                <InputField type="email" id="newsletter-email" required={true}>* E-mail</InputField>
                <InputField type="text" id="newsletter-date" required={false}>{labels['date_of_event']}</InputField>
                <CheckboxField id="newsletter-privacy">{labels['accept_privacy']} <Link to={urlPrivacy} onClick={this.clickPrivacy}>{labels['privacy']}</Link></CheckboxField>
                <Trigger
                    disabled={isFetching}
                    onClickTrigger={onSubmit}
                    modifier="c-trigger--newsletter js-an"
                    btnModifier="c-btn c-btn--default">{labels['send']}</Trigger>
                <div className="u-clear"></div>
            </div>
        );
    }

    clickPrivacy(event) {
        event.preventDefault();
        const { urlPrivacy, showPageLoader } = this.props;

        showPageLoader()
            .then(() => browserHistory.push(urlPrivacy))
            .catch((reason) => console.warn(reason));
    }
}

export default NewsletterForm;


/** WEBPACK FOOTER **
 ** ./components/NewsletterForm/NewsletterForm.jsx
 **/
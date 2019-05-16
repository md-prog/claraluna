import React from 'react';
import TransitionGroup from 'react-addons-transition-group';
import { Link, browserHistory } from 'react-router';
import { findDOMNode } from 'react-dom';
import { bindFunctions, deentitizeHtml, Timeout } from '../../utilities/utils';

import PureComponent from '../PureComponent.jsx';
import InputField from '../FormFields/InputField.jsx';
import SelectField from '../FormFields/SelectField.jsx';
import TextareaField from '../FormFields/TextareaField.jsx';
import CheckboxField from '../FormFields/CheckboxField.jsx';
import CircleIcon from '../Buttons/CircleIcon.jsx';
import ThankYouMessage from '../ThankYouMessage/ThankYouMessage.jsx';

class BookOverlay extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['closeOverlay', 'clickPrivacy']);

        this.state = {
            isClosing: false
        };

        this.spriteConfig = {
            frameProportion: 1.78,
            frames: 25
        };
    }

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.isClosing !== this.state.isClosing) {
            this.setState({
                isClosing: nextProps.isClosing
            });
        }
    }

    closeOverlay() {
        const { frameButtonBookAnAppointment } = this.props;

        return new Promise((resolve, reject) => {
            this.setState({
                isClosing: true
            }, () => {
                new Timeout(1000)
                    .then(() => {
                        frameButtonBookAnAppointment();
                        this.setState({
                            isClosing: false
                        });
                        resolve();
                    });
            });
        });
    }

    getModifier(frameButtonState) {
        const modifier = {
            [0]: 'is-book-close',
            [1]: 'is-book-close',
            [2]: 'is-book-open',
            [3]: 'is-book-close'
        };

        return modifier[frameButtonState] ? modifier[frameButtonState] : '';
    }

    clickPrivacy(event) {
        event.preventDefault();

        const { urlPrivacy, showPageLoader } = this.props;

        this.closeOverlay()
            .then(() => {
                showPageLoader()
                    .then(() => browserHistory.push(urlPrivacy))
                    .catch((reason) => console.warn(reason));
            })
            .catch((reason) => console.warn(reason));
    }

    render() {

        const { isFetching, frameButtonState, appState, page, atelier, urlPrivacy, labels } = this.props;
        const { windowWidth, windowHeight } = appState;

        const wW = windowWidth;
        const wH = windowHeight;
        const modifier = this.state.isClosing ? 'is-book-closing' : this.getModifier(frameButtonState);

        let layerWidth, layerHeight;

        if (wW / wH > this.spriteConfig.frameProportion) {
            layerWidth = wW;
            layerHeight = layerWidth / this.spriteConfig.frameProportion;
        } else {
            layerHeight = wH;
            layerWidth = layerHeight * this.spriteConfig.frameProportion;
        }

        const spriteStyle = {
            width: layerWidth * this.spriteConfig.frames + 'px',
            height: layerHeight + 'px'
        };

        const atelierData = [{ city: 'Not specified' }].concat(atelier);

        return (
            <div className={`o-book ${modifier}`}>
                <div className="o-book__inner">

                    <div className="o-book__side">
                        <h3 className="o-book__title u-text--geometric u-p--2@mobile js-an">{labels['book_an_appointment']}</h3>
                        <div className="o-grid">
                            <div className="o-grid__item u-50@tablet u-p--2@mobile u-pr--2">
                                <InputField type="text" id="book-name" theme="t-primary" required={true}>* {labels['name']}</InputField>
                            </div>
                            <div className="o-grid__item u-50@tablet u-p--2@mobile u-pl--2">
                                <InputField type="email" id="book-mail" theme="t-primary" required={true}>* {labels['e_mail']}</InputField>
                            </div>
                        </div>
                        <div className="o-grid">
                            <div className="o-grid__item u-50@tablet u-p--2@mobile u-pr--2">
                                <InputField type="tel" id="book-phone" theme="t-primary" required={true}>* {labels['phone']}</InputField>
                            </div>
                            <div className="o-grid__item u-50@tablet u-p--2@mobile u-pl--2">
                                <InputField type="text" id="book-data" theme="t-primary" required={true}>* {labels['wedding_date']}</InputField>
                            </div>
                        </div>
                        <div className="o-grid">
                            <div className="o-grid__item u-p--2@mobile">
                                <SelectField id="book-atelier" placeholder={`${labels['choose_atelier']}`} data={atelierData || []} theme="t-primary" />
                            </div>
                        </div>
                        <div className="o-grid">
                            <div className="o-grid__item u-p--2@mobile">
                                <TextareaField id="book-notes" theme="t-primary" required={true}>* {labels['note']}</TextareaField>
                            </div>
                        </div>
                        <div className="o-grid">
                            <div className="o-grid__item u-p--2@mobile">
                                <CheckboxField id="book-privacy" theme="t-primary">{labels['accept_privacy']} <Link to={urlPrivacy} onClick={this.clickPrivacy}>{labels['privacy']}</Link></CheckboxField>
                            </div>
                        </div>
                    </div>

                    <div className="o-book__side u-p--2@mobile">
                        <h3 className="o-book__title u-text--geometric js-an">{page.title}</h3>
                        <div className="js-an" dangerouslySetInnerHTML={{__html: deentitizeHtml(page.description)}} />
                    </div>

                    <div className="o-book__transition">
                        <div className="o-book__background" style={spriteStyle}></div>
                    </div>

                    <TransitionGroup className="o-thx">
                        {
                            isFetching &&
                                <ThankYouMessage>
                                    <h3 className="o-page__title u-white">{labels['thanks']}</h3>
                                </ThankYouMessage>
                        }
                    </TransitionGroup>

                </div>
            </div>
        );
    }
}

BookOverlay.propTypes = {
    frameButtonState: React.PropTypes.number,
    appState: React.PropTypes.object.isRequired,
    page: React.PropTypes.object.isRequired,
    atelier: React.PropTypes.array,
    labels: React.PropTypes.object,
    urlPrivacy: React.PropTypes.string
};

export default BookOverlay;



import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import { connect } from 'react-redux';
import {findDOMNode} from 'react-dom';
import TransitionGroup from 'react-addons-transition-group';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Actions Creators
import { showPageLoader, hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';
import { showReservedAreaLink } from '../../components/Frame/actions-reserved-area';

// Utilities
import { bindFunctions, getLabels, Timeout, validateEmail } from '../../utilities/utils';

// Components
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import ThankYouMessage from '../../components/ThankYouMessage/ThankYouMessage.jsx';
import NewsletterForm from '../../components/NewsletterForm/NewsletterForm.jsx';

class Newsletter extends PageContainer {
    constructor(props) {
        super(props);

        this.newsletterPage = props.pages.find(page => page.name === 'newsletter');
        this.newsletterImage = global.pD + (this.newsletterPage.bgImage || DEFAULT_IMG);
        this.seoParams = this.getSeoParams('pages', this.newsletterPage);

        this.labels = getLabels(props.labels, [
            'url_privacy',
            'accept_privacy',
            'privacy',
            'send',
            'thanks',
            'date_of_event'
        ]);

        this.state = {
            isFetching: false
        };

        this.urlPrivacy = `${this.urlLangSuffix}/${this.labels['url_privacy']}`;

        this.boundedShowPageLoader = bindActionCreators(showPageLoader, props.dispatch);

        bindFunctions.call(this, ['submitHandler']);
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, dispatch, frameActionCreators } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameActionCreators); // Copy of props
        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);
            pageLoaderPromise
                .then(() => { this.dispatchActions(app, this.afterLoaderActions, dispatch); })
                .catch(reasons => console.warn(reasons));
        }
    }

    submitHandler() {
        const { app } = this.props;
        const { lang } = app;

        this.el = findDOMNode(this);
        const newsletterMail = this.el.querySelector('#newsletter-email');
        const newsletterDate = this.el.querySelector('#newsletter-date');
        const newsletterPrivacy = this.el.querySelector('#newsletter-privacy');
        const formItems = Array.from(this.el.querySelectorAll('.js-an'));
        const newsletterLang = (lang === 'it-IT') ? 'it' : 'de';

        const hideForm = () => {
            this.setState({ isFetching: true });
            TweenMax.staggerTo(formItems.reverse(), 0.7, { y: 50, opacity: 0, ease: Power3.easeIn }, 0.05);
        };

        const showForm = (formMail, formDate) => {
            this.setState({ isFetching: false });
            // Svuoto i campi
            formMail.value = '';
            formDate.value = '';
            // Appaio il fomr
            TweenMax.staggerFromTo(formItems, 0.7, { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.7, ease: Power3.easeOut }, 0.1);
        };

        const formValidation = () => {
            let passed = true;
            if (!validateEmail(newsletterMail.value)) {
                console.info('E-mail is not valid ', newsletterMail.value);
                newsletterMail.parentElement.classList.add('has-error');
                passed = false;
            }

            if (!newsletterPrivacy.checked) {
                console.info('Privacy has not been accepted', newsletterPrivacy.value);
                newsletterPrivacy.parentElement.classList.add('has-error');
                passed = false;
            }

            return passed;
        };

        if (formValidation()) {

            if (this.state.isFetching) {
                return false;
            }

            hideForm();

            // Invio i dati
            const client = new XMLHttpRequest();
            client.open('POST', `${global.pD}/ajax.aspx/Newsletter`);
            client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            // client.responseType = 'json';
            client.send(JSON.stringify({
                newsletterMail: newsletterMail.value,
                newsletterDate: newsletterDate.value,
                newsletterLang
            }));

            client.onload = function () {
                //
                // Analytics
                if (__CLIENT__) {
                    window.dataLayer.push({
                        'event': 'GAevent',
                        'eventCategory': 'newsletter',
                        'eventAction': 'ok',
                        'eventLabel': 'newsletter-ok'
                    });
                }

                if (this.status === 200) {
                    const response = JSON.parse(this.response);
                    console.log(typeof response, response);
                } else {
                    console.warn('SUCCESS, BUT...', this.statusText);
                }
            };

            client.onerror = function () {
                console.error('ERROR: ', this.statusText);
            };

            new Timeout(4000)
                .then(() => showForm(newsletterMail, newsletterDate));

        }

        return false;
    }

    render() {
        const {title, description, bgImage} = this.newsletterPage;

        return (
            <div className="o-newsletter">
                <BackgroundImage src={`${global.pD || ''}${bgImage}`} />

                <div className="o-newsletter__inner">
                    <h1 className="o-newsletter__title u-text--title js-an">{title}</h1>
                    <p className="o-newsletter__description js-an" dangerouslySetInnerHTML={{__html: description}} />
                    <NewsletterForm
                        urlPrivacy={this.urlPrivacy}
                        onSubmit={this.submitHandler}
                        showPageLoader={this.boundedShowPageLoader}
                        isFetching={this.state.isFetching}
                        labels={this.labels}
                    />
                </div>

                <TransitionGroup className="o-thx">
                    { this.state.isFetching &&
                    <ThankYouMessage>
                        <h3 className="o-page__title">{this.labels['thanks']}</h3>
                    </ThankYouMessage> }
                </TransitionGroup>

                <Helmet
                    title={this.seoInfo.title}
                    meta={[
                        {'name': 'description', 'content': this.seoInfo.description},
                        {'property': 'og:image', 'content': this.newsletterImage},
                        {'property': 'og:title', 'content': this.seoInfo.title},
                        {'property': 'og:description', 'content': this.seoInfo.description}
                    ]}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    dispatch,
    frameActionCreators: {
        showMenuTrigger,
        showVatNumber,
        showViewAllCollectionBtn,
        showLogo,
        hideFrameButton,
        showReservedAreaLink
    }
});

const mapStateToProps = state => ({
    app: state.app,
    pages: state.pages,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Newsletter);


/** WEBPACK FOOTER **
 ** ./containers/PageNewsletter/page-Newsletter.jsx
 **/
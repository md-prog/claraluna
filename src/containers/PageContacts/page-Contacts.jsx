import React from 'react';
import { bindActionCreators } from 'redux';
import PageContainer from '../PageContainer.jsx';
import TransitionGroup from 'react-addons-transition-group';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

// Constants
import { DEFAULT_IMG } from '../../constants';

// Utilities
import { bindFunctions, getLabels, validateEmail } from '../../utilities/utils';
import { getPage, getUrlLang } from '../../utilities/pages';

// Actions Creators
import { showPageLoader, hidePageLoader } from '../../components/Loader/actions-PageLoader';
import { hideFrameButton } from '../../components/FrameButton/actions-frameButtonState';
import { showLogo } from '../../components/Logo/actions-logo';
import { showVatNumber } from '../../components/Frame/actions-vat-number';
import { showViewAllCollectionBtn } from '../../components/Collections/actions-CollectionArchiveTrigger';
import { showMenuTrigger } from '../../components/Menu/actions-menu';

// Components
import Helmet from 'react-helmet';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage.jsx';
import ContactForm from '../../components/ContactForm/ContactForm.jsx';
import ThankYouMessage from '../../components/ThankYouMessage/ThankYouMessage.jsx';

class Contacts extends PageContainer {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['submitHandler']);

        this.boundedShowPageLoader = bindActionCreators(showPageLoader, props.dispatch);

        this.page = props.pages.find(p => p.name === 'contacts');
        this.seoParams = this.getSeoParams('pages', this.page);
        this.labels = getLabels(props.labels, [
            'url_privacy',
            'accept_privacy',
            'privacy',
            'phone',
            'contacts',
            'send_us_email',
            'name',
            'e_mail',
            'note',
            'send',
            'thanks'
        ]);

        this.urlPrivacy = `${this.urlLangSuffix}/${this.labels['url_privacy']}`;

        // Page Collections
        this.contactPage = getPage(props.pages, 'contacts');
        this.contactImage = global.pD + (this.contactPage.bgImage || DEFAULT_IMG);

        this.state = {
            isFetching: false
        };
    }

    componentWillMount() {
        super.componentWillMount();

        const { app, dispatch, frameBoundActionCreators } = this.props;
        const { isAppLoading, pageLoaderState } = app;

        // --------------------------------------
        // Dispatch actions after the page loader
        // --------------------------------------
        this.afterLoaderActions = Object.assign({}, frameBoundActionCreators); // Copy of props

        if (!isAppLoading) {
            const pageLoaderPromise = (pageLoaderState > 0)
                ? dispatch(hidePageLoader())
                : Promise.resolve(true);

            pageLoaderPromise
                .then(() => {
                    this.dispatchActions(app, frameBoundActionCreators, dispatch);
                })
                .catch(reasons => console.warn(reasons));
        }
    }

    submitHandler() {
        this.el = findDOMNode(this);
        const contactName = this.el.querySelector('#contacts-name');
        const contactMail = this.el.querySelector('#contacts-email');
        const contactNote = this.el.querySelector('#contacts-notes');
        const contactPrivacy = this.el.querySelector('#contacts-privacy');

        const formValidation = () => {
            let passed = true;
            if (contactName.value.length < 3) {
                console.info('Name is not valid ', contactName.value);
                contactName.parentElement.classList.add('has-error');
                passed = false;
            }
            if (!validateEmail(contactMail.value)) {
                console.info('Email is not valid ', contactMail.value);
                contactMail.parentElement.classList.add('has-error');
                passed = false;
            }
            if (contactNote.value.length < 3) {
                console.info('The message is not valid ', contactNote.value);
                contactNote.parentElement.classList.add('has-error');
                passed = false;
            }
            if (!contactPrivacy.checked) {
                console.info('Privacy has not been accepted', contactPrivacy.value);
                contactPrivacy.parentElement.classList.add('has-error');
                passed = false;
            }
            return passed;
        };

        if (formValidation()) {

            if (this.state.isFetching) return false;

            this.setState({ isFetching: true });

            // Sparisco il form
            const formItems = Array.from(this.el.querySelectorAll('.js-an'));
            TweenMax.staggerTo(formItems.reverse(), 0.7, { y: 50, opacity: 0, ease: Power3.easeIn }, 0.05);

            // Invio i dati
            const client = new XMLHttpRequest();
            client.open('POST', `${global.pD}/ajax.aspx/Contacts`);
            client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            client.send(JSON.stringify({
                contactName: contactName.value,
                contactMail: contactMail.value,
                contactNote: contactNote.value
            }));

            client.onload = function () {
                //
                // Analytics
                if (__CLIENT__) {
                    window.dataLayer.push({
                        'event': 'GAevent',
                        'eventCategory': 'contatto',
                        'eventAction': 'ok',
                        'eventLabel': 'contatto-ok'
                    });
                }
                //
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

            setTimeout(() => {
                contactName.value = '';
                contactMail.value = '';
                contactNote.value = '';

                this.setState({
                    isFetching: false
                });

                // Riappaio il form
                TweenMax.staggerFromTo(
                    formItems,
                    0.7,
                    {
                        y: 50,
                        opacity: 0
                    }, {
                        y: 0,
                        opacity: 1,
                        delay: 0.7,
                        ease: Power3.easeOut
                    }, 0.1);
            }, 4000);
        }
        return false;
    }

    render() {

        return (
            <div className="o-contacts">

                <BackgroundImage src={`${global.pD || ''}${this.contactPage.bgImage}`} />

                <div className="o-contacts__inner">
                    <div className="o-contacts__side js-an" itemScope itemProp="address" itemType="http://schema.org/PostalAddress">
                        <h3 className="o-contacts__title u-text--title">{this.labels['contacts']}</h3>

                        { this.page.description }
                        <address>
                            <span itemProp="name">CLARALUNA S.A.S di Corioni Armando & C.</span><br />
                            <span itemProp="streetAddress">Via Alcide De Gasperi, 39</span><br />
                            <span itemProp="postalCode">25030</span> <span itemProp="addressLocality">Zocco di Erbusco</span><br />
                            <span itemProp="addressRegion">Brescia</span><span itemProp="addressCountry">, Italy</span><br />
                        </address>

                        <p className="u-text--geometric u-mt6@tablet">{this.labels['phone']}</p>
                        <p className="u-text--important" itemProp="postalCode"><small>+39</small> 030 7760317 r.a.</p>

                        {/*
                         <ul className="c-social u-mt6@tablet">
                         <li><a href="#"><i className="o-ico o-ico--facebook"></i></a></li>
                         <li><a href="#"><i className="o-ico o-ico--twitter"></i></a></li>
                         <li><a href="#"><i className="o-ico o-ico--instagram"></i></a></li>
                         <li><a href="#"><i className="o-ico o-ico--youtube"></i></a></li>
                         </ul>
                         */}
                    </div>
                    <div className="o-contacts__side">
                        <ContactForm
                            labels={this.labels}
                            onSubmit={this.submitHandler}
                            urlPrivacy={this.urlPrivacy}
                            showPageLoader={this.boundedShowPageLoader}
                            isFetching={this.state.isFetching}
                        />
                    </div>
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
                        {'property': 'og:image', 'content': this.contactImage},
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
    frameBoundActionCreators: {
        showMenuTrigger,
        showVatNumber,
        showViewAllCollectionBtn,
        showLogo,
        hideFrameButton
    }
});

const mapStateToProps = (state) => ({
    app: state.app,
    pages: state.pages,
    labels: state.labels,
    seo: state.seo
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);


/** WEBPACK FOOTER **
 ** ./containers/PageContacts/page-Contacts.jsx
 **/
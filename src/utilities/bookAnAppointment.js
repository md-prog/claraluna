import { validateEmail, Timeout } from './utils';

export const validation = (bookName, bookMail, bookPhone, bookData, bookNote, bookPrivacy) => {
    let passed = true;
    if (bookName.value.length < 3) {
        // console.info('Name is not valid ', bookName.value);
        bookName.parentElement.classList.add('has-error');
        passed = false;
    }
    if (!validateEmail(bookMail.value)) {
        // console.info('Email is not valid ', bookMail.value);
        bookMail.parentElement.classList.add('has-error');
        passed = false;
    }
    if (bookPhone.value.length < 5) {
        // console.info('Date is not valid ', bookPhone.value);
        bookPhone.parentElement.classList.add('has-error');
        passed = false;
    }
    if (bookData.value.length < 3) {
        // console.info('Date is not valid ', bookData.value);
        bookData.parentElement.classList.add('has-error');
        passed = false;
    }
    if (bookNote.value.length < 3) {
        // console.info('Note is not valid ', bookNote.value);
        bookNote.parentElement.classList.add('has-error');
        passed = false;
    }
    if (!bookPrivacy.checked) {
        // console.info('Privacy has not been accepted', bookPrivacy.value);
        bookPrivacy.parentElement.classList.add('has-error');
        passed = false;
    }

    return passed;
};

export const sendData = (book, bookAtelier, bookName, bookMail, bookPhone, bookData, bookNote, bookPrivacy, bookWishlist) => {
    let formItems = [];

    // Sparisco il form
    if (__CLIENT__ && book) {
        formItems = Array.from(book.querySelectorAll('.js-an'));
        TweenMax.staggerTo(formItems.reverse(), 0.7, {y: 50, opacity: 0, ease: Power3.easeIn}, 0.05);

        //
        // Analytics
        window.dataLayer.push({
            'event': 'GAevent',
            'eventCategory': 'abiti',
            'eventAction': window.location.pathname,
            'eventLabel': 'prenota-ok'
        });
    }

    // Invio i dati
    const client = new XMLHttpRequest();
    client.open('POST', `${global.pD}/ajax.aspx/BookAnAppointment`);
    client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    client.send(JSON.stringify({
        bookName: bookName && bookName.value,
        bookMail: bookMail && bookMail.value,
        bookPhone: bookPhone && bookPhone.value,
        bookAtelier: bookAtelier && bookAtelier.value,
        bookData: bookData && bookData.value,
        bookNote: bookNote && bookNote.value,
        bookPrivacy: bookPrivacy && bookPrivacy.value,
        bookWishlist
    }));

    client.onload = function () {
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
        .then(() => {
            // Riappaio il form
            if (__CLIENT__) {
                bookName.value = '';
                bookMail.value = '';
                bookPhone.value = '';
                bookData.value = '';
                bookNote.value = '';

                TweenMax.staggerFromTo(formItems, 0.7, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    delay: 0.7,
                    ease: Power3.easeOut,
                    onComplete: () => {
                        TweenMax.set(formItems, {clearProps: 'all'});
                    }
                }, 0.1);
            }

        });
};


/** WEBPACK FOOTER **
 ** ./utilities/bookAnAppointment.js
 **/
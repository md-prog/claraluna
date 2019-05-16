export function throttle( delay, noTrailing, callback, debounceMode ) {

    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeoutID;

    // Keep track of the last time `callback` was executed.
    var lastExec = 0;

    // `noTrailing` defaults to falsy.
    if ( typeof noTrailing !== 'boolean' ) {
        debounceMode = callback;
        callback = noTrailing;
        noTrailing = undefined;
    }

    // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.
    function wrapper () {

        var self = this;
        var elapsed = Number(new Date()) - lastExec;
        var args = arguments;

        // Execute `callback` and update the `lastExec` timestamp.
        function exec () {
            lastExec = Number(new Date());
            callback.apply(self, args);
        }

        // If `debounceMode` is true (at begin) this is used to clear the flag
        // to allow future `callback` executions.
        function clear () {
            timeoutID = undefined;
        }

        if ( debounceMode && !timeoutID ) {
            // Since `wrapper` is being called for the first time and
            // `debounceMode` is true (at begin), execute `callback`.
            exec();
        }

        // Clear any existing timeout.
        if ( timeoutID ) {
            clearTimeout(timeoutID);
        }

        if ( debounceMode === undefined && elapsed > delay ) {
            // In throttle mode, if `delay` time has been exceeded, execute
            // `callback`.
            exec();

        } else if ( noTrailing !== true ) {
            // In trailing throttle mode, since `delay` time has not been
            // exceeded, schedule `callback` to execute `delay` ms after most
            // recent execution.
            //
            // If `debounceMode` is true (at begin), schedule `clear` to execute
            // after `delay` ms.
            //
            // If `debounceMode` is false (at end), schedule `callback` to
            // execute after `delay` ms.
            timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
        }

    }

    // Return the wrapper function.
    return wrapper;

}

export function bindFunctions(functions) {
    functions.forEach(f => this[f] = this[f].bind(this));
}

export function validateEmail(value) {
    const pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(value);
}

export function getLabels(database, keys = []) {
    const result = {};
    keys.map(k => {
        const label = database.find(item => item.key === k);
        if (label) {
            result[k] = label.value;
        }
    });
    return result;
}

export function isEmpty(obj) {
    // Speed up calls to hasOwnProperty
    const hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj === null) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (const key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

/**
 * Check the body::after content and return the current media query as string
 * @returns {string}
 */
export function getDevice() {

    let device = (__CLIENT__)
      ? global.getComputedStyle(document.body, '::after').getPropertyValue('content')
      : '';

    device = device.replace(/('|")/g, '');

    return device;
}

export function setCookie(name, value = '', duration = 60) {
    const d = new Date();
    d.setTime(d.getTime() + (duration * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

export function getCookie(name) {
    if (__CLIENT__) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');

        return (parts.length === 2) ? parts.pop().split(';').shift() : '';
    } else {
        return '';
    }

}

export function deleteCookie(name) {
    setCookie(name, '', -1);
}

export function testCookie() {
    const nameTestCookie = 'test_cookie';
    document.cookie = nameTestCookie;
    const test = (document.cookie.indexOf(nameTestCookie) > -1);
    test && deleteCookie(nameTestCookie);

    return test;
}

export function arrayEqual(array1 = [], array2 = []) {
    return (array1.length === array2.length) && array1.every((el, index) => el === array2[index]);
}

export function deepEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
        const isObject = typeof objA[keysA[i]] === 'object';
        if (!bHasOwnProperty(keysA[i])) {
            return false;
        }
        if (isObject) {
            return deepEqual(objA[keysA[i]], objB[keysA[i]]);
        } else {
            return (objA[keysA[i]] === objB[keysA[i]]);
        }
    }

    return true;
}

export function deentitizeHtml(string) {
    let ret = string.replace(/&gt;/g, '>');
    ret = ret.replace(/&lt;/g, '<');
    ret = ret.replace(/&quot;/g, '"');
    ret = ret.replace(/&apos;/g, "'");
    ret = ret.replace(/&amp;/g, '&');
    return ret;
}

export class Timeout {
    constructor(delay) {
        this.setDefaultValues();

        new Promise((resolve, reject) => {
            this.timer = window.setTimeout(resolve, delay);
        })
        .then(response => this.thenAction(response))
        .catch(reason => console.warn(reason));
    }

    then(callback) {
        this.thenAction = callback;
        return this;
    }

    clear() {
        window.clearTimeout(this.timer);
        this.setDefaultValues();
    }

    setDefaultValues() {
        this.thenAction = response => true;
        this.timer = undefined;
    }
}

export function changeUrlParameter(url, key, val) {
    let TheAnchor        = null,
        newAdditionalURL = '',
        tempArray        = url.split('?'),
        baseURL          = tempArray[0],
        additionalURL    = tempArray[1],
        temp             = '',
        value            = val;

    if (additionalURL) {
        const tmpAnchor = additionalURL.split('#');
        const TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor) {
            additionalURL = TheParams;
        }

        tempArray = additionalURL.split('&');

        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] !== key) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    } else {
        const tmpAnchor = baseURL.split('#');
        const TheParams = tmpAnchor[0];
        TheAnchor     = tmpAnchor[1];

        if (TheParams) {
            baseURL = TheParams;
        }
    }

    if (TheAnchor) {
        value += '#' + TheAnchor;
    }

    const rowsText = temp + '' + key + '=' + value;
    return baseURL + '?' + newAdditionalURL + rowsText;

}

export function preloadImage(src) {
    global.cachedImages = global.cachedImages || [];

    const found = global.cachedImages.find(cache => cache.src === src);

    return found
        ? Promise.resolve(found.ref)
        : new Promise((resolve, reject) => {
            const image = new window.Image();
            image.onload = () => resolve(image);
            image.onerror = () => resolve(false);
            image.src = src;
            global.cachedImages.push({
                src: image.src,
                ref: image
            });
        });
}



/** WEBPACK FOOTER **
 ** ./utilities/utils.js
 **/
export default function http(url, lang) {
    const core = {

        ajax: function (method, url, args) {

            return new Promise( function (resolve, reject) {

                const client = new XMLHttpRequest();

                let uri = url;

                if (args && (method === 'POST' || method === 'PUT')) {
                    uri += '?';
                    let argcount = 0;
                    for (let key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }

                client.open(method, uri);
                client.setRequestHeader('Accept-Language', lang);
                client.send();

                client.onload = function () {
                    if (this.status === 200) {
                        resolve(this.response);
                    } else {
                        reject(this.statusText);
                    }
                };

                client.onerror = function () {
                    reject(this.statusText);
                };

            });

        }
    };

    // Adapter pattern
    return {
        'get' : function(args) {
            return core.ajax('GET', url, args);
        },
        'post' : function(args) {
            return core.ajax('POST', url, args);
        },
        'put' : function(args) {
            return core.ajax('PUT', url, args);
        },
        'delete' : function(args) {
            return core.ajax('DELETE', url, args);
        }
    };
}


/** WEBPACK FOOTER **
 ** ./utilities/apiCall.js
 **/
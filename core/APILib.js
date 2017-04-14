/**
 * Created by user on 24.05.16.
 */

'use strict';
// var SessionModel = require('./db/model/Session.js');
let fetch = require('node-fetch');
var API = {};
API.res = null;

const STATUS_FAIL = 'fail';
const STATUS_SUCCESS = 'success';

var errors = {
    UNKNOWN: {
        code: 1,
        text: 'Unknown error'
    },

    USER_EXIST: {
        code: 100,
        text: 'User exist'
    },
    EMAIL_EXIST: {
        code: 100,
        text: 'Email exist'
    },
    PHONE_NUMBER_EXIST: {
        code: 100,
        text: 'Phone number exist'
    },
    MISSED_FIELD: {
        code: 101,
        text: 'Some fields missing'
    },

    USER_NOT_FOUND: {
        code: 102,
        text: 'User not found'
    },

    USER_PASSWORD_NOT_MATCH: {
        code: 103,
        text: 'User password not match'
    },

    USER_CODE_NOT_MATCH: {
        code: 103,
        text: 'Code not match'
    },

    INVALID_EMAIL_ADDRESS: {
        code: 400,
        text: 'Invalid E-mail address'
    },
    
    INVALID_PHONE_NUMBER: {
        code: 400,
        text: 'Invalid phone number'
    },
    
    INVALID_PRICE: {
        code: 400,
        text: 'Invalid price value'
    },

    UNAUTHORIZED: {
        code: 401,
        text: 'Unauthorized'
    },

    ACCESS_DENIED: {
        code: 403,
        text: 'Access denied'
    },

    NOT_FOUND: {
        code: 404,
        text: 'Not found'
    },


};

API.errors = errors;

API.responce = function (status, code, data) {

    //simple form API.response(data)
    if (typeof code == 'undefined' && typeof data == 'undefined') {
        data = status;
        code = 0;
        status = STATUS_SUCCESS;
    }

    status = typeof status == 'undefined' ? STATUS_SUCCESS : status;
    code = typeof code == 'undefined' ? 0 : code;
    data = typeof data == 'undefined' ? {} : data;

    return {
        status: status,
        code: code,
        data: data
    };
};

API.response = API.responce;

API.success = (res, data) => {
    if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
    if (!data) {
        data = res;
        res = API.res;
    }
    if (!res || !res.json) throw new Error('Response should be a valid express response object');
    return res.json(API.response(data));
};

API.fail = (res, error) => {
    if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
    if (!error) {
        error = res;
        res = API.res;
    }
    if (!res || !res.json) throw new Error('Response should be a valid express response object');
    return res.json(API.error(error));
};

API.error = function (errorMsg, errorCode) {
    errorMsg = typeof errorMsg == 'undefined' ? '' : errorMsg;
    errorCode = typeof errorCode == 'undefined' ? 0 : errorCode;

    if (typeof errorMsg == 'object') {
        errorCode = errorMsg.code;
        errorMsg = errorMsg.text;
    }

    return API.responce(STATUS_FAIL, errorCode, {msg: errorMsg});
};

/**
 * Basic HTTP GET request
 * @param url
 * @returns {Promise.<JSON>}
 */

API.get = url => {
    return fetch(url)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        })
        .then(response => response.json());
};

/**
 * Basic HTTP POST request
 * @param url
 * @param data
 * @returns {Promise.<JSON>}
 */

API.post = (url, data) => {
    console.log('post')
    let _body = '';
    if (typeof data == 'object') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let value = data[key];
                if (typeof value == 'object') {
                    value = JSON.stringify(value);
                }
                _body += (_body.length ? '&' : '') + key + '=' + value;
            }
        }
    } else {
        _body = data;
    }
    return fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: _body
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        })
        .then(response => response.json());
};

API.emailSubscribe = email => {
    let url = 'https://us13.api.mailchimp.com/3.0/lists/c349d0f029/members';
    return fetch(url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic YW55c3RyaW5nOjZiMDJhNjEwNjkyNjUxYWNiMTFhMDBlN2QwYjJmYzdlLXVzMTM"
            },
            body: `{"email_address":"${email}","status":"subscribed"}`
        }
    ).then(r => r.json()).catch(e => console.log(e));
};

API.getGoogleAuth = url => {
    return fetch(url)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        })
        .then(response => response.json());
};

module.exports = API;
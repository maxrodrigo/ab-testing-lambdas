'use strict';

const sourceCookie = '_yd_ab_source';
const sourceMain = 'G2bHPu5G'; // hashids (1,2,1)
const sourceExperiment = '0rlHlu9d'; // hashids (1,2,2)

const cookiePath = '/';

const hasCookie = (cookies, name, value = null) => {
    const pattern = value ? `${name}=${value}` : `${name}`;
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].value.indexOf(pattern) >= 0) {
            return true;
        }
    }
    return false;
};

// Origin Response handler
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const requestHeaders = request.headers;
    const response = event.Records[0].cf.response;

    if (hasCookie(requestHeaders.cookie, sourceCookie, sourceMain)) {
        setCookie(response, `${sourceCookie}=${sourceMain}`);
    }

    if (hasCookie(requestHeaders.cookie, sourceCookie, sourceExperiment)) {
        setCookie(response, `${sourceCookie}=${sourceExperiment}`);
    }

    callback(null, response);
    return;
};

// Add set-cookie header (including path)
const setCookie = function(response, cookie) {
    const cookieValue = `${cookie}; Path=${cookiePath}; Domain=.yourdictionary.com`;
    response.headers['set-cookie'] = [{ key: "Set-Cookie", value: cookieValue }];
};

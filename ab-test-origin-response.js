'use strict';

const returningUserCookie = '_yd_ab_ret';
const experimentVersion = 'DA6gHVdJ'; // hashids (1,1)

const sourceCookie = '_yd_ab_source';
const sourceMain = 'AyzHWHBd'; // hashids (1,1,1)
const sourceExperiment = 'G2bHEHgG'; // hashids (1,1,2)

const cookiePath = '/';

const hasCookie = (cookies, name, value = null) => {
    const pattern = value ? `${name}=${value}` : `${name}`;
    console.log(`Function hasCookie ${pattern} ?`);
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].value.indexOf(pattern) >= 0) {
            console.log(`${pattern} found.`);
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

    setCookie(response, `${returningUserCookie}=${experimentVersion}`);

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

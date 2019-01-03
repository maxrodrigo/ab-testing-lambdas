'use strict';

const sourceCookie = {cookie_name};
const sourceMain = {source_main};
const sourceExperiment = {source_experiment};

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
    const cookieValue = `${cookie}; Path=/; Domain=.yourdictionary.com`;
    response.headers['set-cookie'] = [{ key: "Set-Cookie", value: cookieValue }];
};

'use strict';

const returningUserCookie = '_yd_ab_ret';
const experimentVersion = 'DA6gHVdJ'; // hashids (1,1)

const sourceCookie = '_yd_ab_source';
const sourceMain = 'AyzHWHBd'; // hashids (1,1,1)
const sourceExperiment = 'G2bHEHgG'; // hashids (1,1,2)

const cookiePath = '/';
const cookieExpires = "Sat, 26 Apr 1980 11:29:17 GMT"

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

    setCookie(response, `${returningUserCookie}=${experimentVersion}`);

    if (hasCookie(requestHeaders.cookie, sourceCookie, sourceMain)) {
        console.log('Main Source cookie found');
        setCookie(response, `${sourceCookie}=${sourceMain}`);
    }else{
        deleteCookie(response, sourceCookie);
    }

    if (hasCookie(requestHeaders.cookie, sourceCookie, sourceExperiment)) {
        console.log('Experiment Source cookie found');
        setCookie(response, `${sourceCookie}=${sourceExperiment}`);
    }else{
        deleteCookie(response, sourceCookie);
    }

    callback(null, response);
    return;
};

// Add set-cookie header (including path)
const setCookie = function(response, cookie) {
    const cookieValue = `${cookie}; Path=${cookiePath}`;
    console.log(`Setting cookie ${cookieValue}`);
    response.headers['set-cookie'] = [{ key: "Set-Cookie", value: cookieValue }];
};

// Add set-cookie header (including path)
const deleteCookie = function(response, cookie) {
    console.log(`Deleting cookie ${cookie}`);
    const cookieValue = `${cookie}; Path=${cookiePath}; Expires=${cookieExpires}`;
    response.headers['set-cookie'] = [{ key: "Set-Cookie", value: cookieValue }];
};

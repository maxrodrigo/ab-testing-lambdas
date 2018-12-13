'use strict';

const returningUserCookie = '_yd_ab_ret';
const experimentVersion = 'DA6gHVdJ'; // hashids (1,1)

const sourceCookie = '_yd_ab_source';
const sourceMain = 'AyzHWHBd'; // hashids (1,1,1)
const sourceExperiment = 'G2bHEHgG'; // hashids (1,1,2)

const experimentTraffic = 0.0;

const hasCookie = (cookies, name, value = null) => {
    const pattern = value ? `${name}=${value}` : `${name}`;
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].value.indexOf(pattern) >= 0) {
            return true;
        }
    }
    return false;
};

// Sets a new cookie in headers' cookies array or updates its value if
// it already exists.
const setCookie = (cookies, name, value) => {
    console.log('Setting cookie:', name, '=', value);
    let found = false;
    const cookie = `${name}=${value}`;
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].value.indexOf(name) >= 0) {
            found = true;
            cookies[i].value = cookies[i].value.replace(
                new RegExp(`${name}=[^;]+`),
                cookie,
            );
        }
    }
    if (!found) {
        cookies.push({key: 'Cookie', value: cookie});
    }
};

const deleteCookie = (cookies, name) => {
    console.log('Deleting cookie:', name);
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].value.indexOf(name) >= 0) {
            cookies[i].value = cookies[i].value.replace(
                new RegExp(`${name}=[^;]+;?`),
                '',
            );
        }
    }
};

// Viewer request handler
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // Look for source cookie
    if (hasCookie(headers.cookie, returningUserCookie, experimentVersion)) {
        if (!hasCookie(headers.cookie, sourceCookie)) {
            const source =
                Math.random() < experimentTraffic
                    ? sourceExperiment
                    : sourceMain;
            setCookie(headers.cookie, sourceCookie, source);
        }
    } else {
        console.log('First cookie not set or old experiment id.');
        setCookie(headers.cookie, returningUserCookie, experimentVersion);
        deleteCookie(headers.cookie, sourceCookie);
    }
    callback(null, request);
};

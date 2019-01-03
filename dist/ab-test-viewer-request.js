'use strict';

const sourceCookie = "_yd_ab_source";
const sourceMain = "G2bHPu5G";
const sourceExperiment = "0rlHlu9d";
const experimentTraffic = 0.1;

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

// Viewer request handler
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    headers.cookie = headers.cookie || [];

    if (
        !hasCookie(headers.cookie, sourceCookie, sourceMain) &&
        !hasCookie(headers.cookie, sourceCookie, sourceExperiment)
    ) {
        const source =
            Math.random() < experimentTraffic ? sourceExperiment : sourceMain;
        setCookie(headers.cookie, sourceCookie, source);
    }
    callback(null, request);
};

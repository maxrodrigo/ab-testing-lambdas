'use strict';

const sourceCookie = "{cookie_name}";
const sourceMain = "{source_main}";
const sourceExperiment = "{source_experiment}";
const experimentDomainName = "{experiment_domain_name}";

// Origin Request handler
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    const source = decideSource(headers);

    // If Source is Experiment, change Origin and Host header
    if ( source === sourceExperiment && request.uri == '/' && headers.host[0].value == 'www.yourdictionary.com') {
        // Specify Origin
        request.origin = {
            custom: {
                domainName: experimentDomainName,
                port: 80,
                protocol: 'http',
                path: '',
                sslProtocols: ['TLSv1', 'TLSv1.1'],
                readTimeout: 5,
                keepaliveTimeout: 5,
                customHeaders: {}
            }
        };

        request.headers['host'] = [{ key: 'host', value: experimentDomainName }];
    }
    // No need to change anything if Source was Main or undefined

    callback(null, request);
};

// Decide source based on source cookie.
const decideSource = function(headers) {
    const sourceMainCookie = `${sourceCookie}=${sourceMain}`;
    const sourceExperimenCookie = `${sourceCookie}=${sourceExperiment}`;

    // Remember a single cookie header entry may contains multiple cookies
    if (headers.cookie) {
        // ...ugly but simple enough for now
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].value.indexOf(sourceExperimenCookie) >= 0) {
                return sourceExperiment;
            }
            if (headers.cookie[i].value.indexOf(sourceMainCookie) >= 0) {
                return sourceMain;
            }
        }
    }
};

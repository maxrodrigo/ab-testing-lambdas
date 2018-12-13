'use strict';

const sourceCoookie = 'X-Source';
const sourceMain = 'yd-v1';
const sourceExperiment = 'yd-v2';
const experimentDomainName = '';
const experimentAvailablePaths = ['/']

// Origin Request handler
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    const source = decideSource(headers);

    // If Source is Experiment, change Origin and Host header
    if ( source === sourceExperiment && experimentAvailablePaths.indexOf(request.uri) !== -1) {
        console.log('Setting Origin to experiment bucket');
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
    const sourceMainCookie = `${sourceCoookie}=${sourceMain}`;
    const sourceExperimenCookie = `${sourceCoookie}=${sourceExperiment}`;

    // Remember a single cookie header entry may contains multiple cookies
    if (headers.cookie) {
        // ...ugly but simple enough for now
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].value.indexOf(sourceExperimenCookie) >= 0) {
                console.log('Experiment Source cookie found');
                return sourceExperiment;
            }
            if (headers.cookie[i].value.indexOf(sourceMainCookie) >= 0) {
                console.log('Main Source cookie found');
                return sourceMain;
            }
        }
    }
    console.log('No Source cookie found (Origin undecided)');
};

'use strict';

const Q = require('q');
const request = require('request');
const config = require('../config');

const EndpointChecker = function() {

    this.check = (endpointToTest, method, acceptedResponseCodes) => {
        let d = Q.defer();

        if (!acceptedResponseCodes.length) {
            acceptedResponseCodes = config.defaultAcceptedResponseCodes;
        }

        request[method](endpointToTest, (error, response, body) => {
            if (error || !acceptedResponseCodes.includes(response.statusCode)) {
                d.reject(new Error('Received an error code from ' + method + ' ' + endpointToTest));
            } else {
                d.resolve('Resource OK');
            }
        });

        return d.promise;
    };

};

module.exports = EndpointChecker;

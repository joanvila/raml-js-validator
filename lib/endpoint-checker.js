'use strict';

const Q = require('q');
const request = require('request');

const EndpointChecker = function() {

    this.check = function(endpointToTest, method) {
        let d = Q.defer();

        request[method](endpointToTest, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                d.reject(new Error('Received an error code from ' + method + ' ' + endpointToTest));
            } else {
                d.resolve('Resource OK');
            }
        });

        return d.promise;
    };

};

module.exports = EndpointChecker;

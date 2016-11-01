'use strict';

const Q = require('q');
const request = require('request');

const EndpointChecker = function() {

    this.check = function(endpointToTest) {
        let d = Q.defer();

        request.get(endpointToTest, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                d.reject(new Error('Received a non 200 error code'));
            } else {
                d.resolve('Resource OK');
            }
        });

        return d.promise;
    };

};

module.exports = EndpointChecker;

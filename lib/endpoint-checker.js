'use strict';

const Q = require('q');
const request = require('request');
const config = require('../config');

const EndpointChecker = function() {

    this.check = (endpointToTest, method, acceptedResponseCodes, postData) => {
        let d = Q.defer();

        if (!acceptedResponseCodes.length) {
            acceptedResponseCodes = config.defaultAcceptedResponseCodes;
        }

        request[method](endpointToTest, {form: postData}, (error, response, body) => {
            if (error || !acceptedResponseCodes.includes(response.statusCode)) {
                d.reject(new Error('[ERROR][' + method + '] ' + endpointToTest +
                    '\n    Request body: ' + JSON.stringify(postData) +
                    '\n    Response: ' + response.statusCode + ' ' + response.body));
            } else {
                d.resolve('Resource OK');
            }
        });

        return d.promise;
    };

};

module.exports = EndpointChecker;

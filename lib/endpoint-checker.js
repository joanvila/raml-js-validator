'use strict';

const Q = require('q');
const request = require('request');
const config = require('../config');

const ResponseSchemaChecker = require('./response-schema-checker');

const EndpointChecker = function() {

    this.responseSchemaChecker = new ResponseSchemaChecker();

    this.check = (endpointToTest, method, expectedResponses, postData, validateResponse) => {
        let d = Q.defer();

        let expectedResponseCodes = getExpectedResponseCodes(expectedResponses);

        request[method](endpointToTest, {form: postData}, (error, response, body) => {
            if (error) {
                d.reject(new Error('Error: ' + error.syscall + ' ' + error.code +
                    ' ' + error.address + ':' + error.port));
            } else if (!expectedResponseCodes.includes(response.statusCode)) {
                d.reject(new Error('[ERROR][' + method + '] ' + endpointToTest +
                    '\n    Request body: ' + JSON.stringify(postData) +
                    '\n    Response: ' + response.statusCode + ' ' + response.body));
            } else {
                if (validateResponse) this.responseSchemaChecker.check(expectedResponses, response);
                d.resolve('Resource OK');
            }
        });

        return d.promise;
    };

    function getExpectedResponseCodes(expectedResponses) {
        let expectedResponseCodes = [];

        expectedResponses.forEach((response) => {
            expectedResponseCodes.push(parseInt(response.code().value(), 10));
        });

        if (!expectedResponseCodes.length) {
            expectedResponseCodes = config.defaultAcceptedResponseCodes;
        }

        return expectedResponseCodes;
    }

};

module.exports = EndpointChecker;

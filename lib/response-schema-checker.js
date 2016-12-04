'use strict';

const _ = require('lodash/core');

const ResponseSchemaChecker = function() {

    const noResponseValidation = {valid: true, validationErrorReason: 'no body'}

    this.check = (expectedResponses, response) => {
        if (_.isEmpty(expectedResponses)) return noResponseValidation;

        const expectedBody = getBodyFromCode(expectedResponses, response.statusCode);
        if (!expectedBody) return noResponseValidation;

        // If a body is defined we need to check it's schema
        const responseBody = JSON.parse(response.body);
        return checkSchema(expectedBody[0], responseBody);
    };

    function getBodyFromCode(expectedResponses, responseCode) {
        let expectedBody = null;

        for (var i in expectedResponses) {
            const expectedCodeValue = parseInt(expectedResponses[i].code().value(), 10);
            if(expectedCodeValue === responseCode) {
                expectedBody = expectedResponses[i].body();
                if (_.isEmpty(expectedBody)) expectedBody = null;
                break;
            }
        }

        return expectedBody;
    }

    function checkSchema(expectedBody, responseBody) {
        let validationResult = {};

        if (expectedBody.type()[0] === typeof(responseBody)) {
            validationResult.valid = true;
            validationResult.validationErrorReason = '';
        } else {
            validationResult.valid = false;
            validationResult.validationErrorReason = expectedBody.type()[0] + ' !== ' + typeof(responseBody);
        }

        return validationResult;
    }

};

module.exports = ResponseSchemaChecker;

'use strict';

const _ = require('lodash');

const ResponseSchemaChecker = function() {

    const noResponseValidation = {valid: true, validationErrorReason: 'no body'};

    this.check = (expectedResponses, response) => {
        if (_.isEmpty(expectedResponses)) return noResponseValidation;

        const expectedBody = getBodyFromCode(expectedResponses, 200);
        // We only want to get the response body according to the 200 status code
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
        const basicTypes = ['object', 'string', 'number'];

        if (_.includes(basicTypes, expectedBody.type()[0])) {
            return simpleResponseTypeCheck(expectedBody, responseBody);
        } else {
            return complexResponseTypeCheck(expectedBody, responseBody);
        }

    }

    function simpleResponseTypeCheck(expectedBody, responseBody) {
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

    function complexResponseTypeCheck(expectedBody, responseBody) {
        let validationResult = {};

        const expectedBodySchema = expectedBody.toJSON().example;
        if (typeof(expectedBodySchema) === 'undefined') {
            validationResult.valid = false;
            validationResult.validationErrorReason = 'No example provided in the RAML file';
            return validationResult;
        }

        const expectedResponseKeys = Object.keys(expectedBodySchema).sort();
        const responseKeys = Object.keys(responseBody).sort();

        if (_.isEqual(expectedResponseKeys, responseKeys)) {
            validationResult.valid = true;
            validationResult.validationErrorReason = '';
        } else {
            validationResult.valid = false;
            validationResult.validationErrorReason = 'Response differs: \n' +
                '        Expected keys: [ ' + expectedResponseKeys + ' ]\n' +
                '        Received from API: [ ' + responseKeys +' ]';
        }

        return validationResult;
    }

};

module.exports = ResponseSchemaChecker;

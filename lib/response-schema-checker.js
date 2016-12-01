'use strict';

const _ = require('lodash/core');

const ResponseSchemaChecker = function() {

    this.check = (expectedResponses, response) => {
        if (_.isEmpty(expectedResponses)) return true;

        const expectedBody = getBodyFromCode(expectedResponses, response.statusCode);
        if (!expectedBody) return true;

        // If a body is defined we need to check it's schema

        //console.log(expectedBody[0].toJSON());
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

};

module.exports = ResponseSchemaChecker;

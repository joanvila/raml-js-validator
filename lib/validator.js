'use strict';

const endpointBuilder = require('./endpoint-builder');
const EndpointChecker = require('./endpoint-checker');

const Validator = function(api, target) {

    this.api = api;
    this.target = target;
    this.endpointChecker = new EndpointChecker();
    this.endpointBuilder = endpointBuilder;

    this.validate = function() {
        let apiResources = this.api.resources();

        apiResources.forEach(resource => {

            // Get the URI parameters
            let uriParameters = [];
            for (let uriParamNum = 0; uriParamNum < resource.allUriParameters().length; ++uriParamNum) {
                uriParameters.push(resource.allUriParameters()[uriParamNum]);
            }

            let unparsedUri = this.endpointBuilder.buildUnparsedUri(this.target, resource);
            let endpointToTest = this.endpointBuilder.parseUriWithParameters(unparsedUri, uriParameters);

            resource.methods().forEach((method) => {

                let acceptedResponseCodes = [];
                method.responses().forEach(function (response) {
                    acceptedResponseCodes.push(parseInt(response.code().value(), 10));
                });

                this.endpointChecker.check(endpointToTest, method.method(), acceptedResponseCodes).then(() => {
                    console.log(method.method() + ' ' + endpointToTest +' OK');
                }).catch(err => {
                    // FIXME: This solution is unstable, a more elegant way to be found
                    // http://stackoverflow.com/questions/30715367/why-can-i-not-throw-inside-a-promise-catch-handler
                    setTimeout(() => { throw err; });
                });
            });
        });
    };
};

module.exports = Validator;

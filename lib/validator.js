'use strict';

const endpointBuilder = require('./endpoint-builder');
const EndpointChecker = require('./endpoint-checker');

const Validator = function(api, target) {

    this.api = api;
    this.target = target;
    this.endpointChecker = new EndpointChecker();

    this.validate = function() {
        let apiResources = this.api.resources();

        apiResources.forEach(resource => {

            // Get the URI parameters
            let uriParameters = [];
            for (let uriParamNum = 0; uriParamNum < resource.allUriParameters().length; ++uriParamNum) {
                uriParameters.push(resource.allUriParameters()[uriParamNum]);
            }

            let unparsedUri = endpointBuilder.buildUnparsedUri(this.target, resource);
            let endpointToTest = endpointBuilder.parseUriWithParameters(unparsedUri, uriParameters);

            resource.methods().forEach((method) => {
                this.endpointChecker.check(endpointToTest, method.method()).then(() => {
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

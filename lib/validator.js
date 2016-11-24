'use strict';

const EndpointBuilder = require('./endpoint-builder');
const EndpointChecker = require('./endpoint-checker');

const Validator = function(api, target) {

    this.api = api;
    this.target = target;
    this.endpointChecker = new EndpointChecker();
    this.endpointBuilder = new EndpointBuilder();

    this.validate = () => {
        const apiResources = this.api.resources();

        apiResources.forEach(resource => {

            // Get the URI parameters
            let uriParameters = [];
            for (let uriParamNum = 0; uriParamNum < resource.allUriParameters().length; ++uriParamNum) {
                uriParameters.push(resource.allUriParameters()[uriParamNum]);
            }

            const unparsedUri = this.endpointBuilder.buildUnparsedUri(this.target, resource);
            let endpointToTest = this.endpointBuilder.parseUriWithParameters(unparsedUri, uriParameters);

            resource.methods().forEach((method) => {

                endpointToTest = this.endpointBuilder.addQueryParams(endpointToTest, method.queryParameters());

                let acceptedResponseCodes = [];
                method.responses().forEach((response) => {
                    acceptedResponseCodes.push(parseInt(response.code().value(), 10));
                });

                this.endpointChecker.check(endpointToTest, method.method(), acceptedResponseCodes).then(() => {
                    console.log('[OK][' + method.method() + '] ' + endpointToTest);
                }).catch(err => {
                    // FIXME: This solution is unstable, a more elegant way to be found
                    // http://stackoverflow.com/questions/30715367/why-can-i-not-throw-inside-a-promise-catch-handler
                    setTimeout(() => { throw err.message; });
                });
            });
        });
    };
};

module.exports = Validator;

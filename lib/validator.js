'use strict';

const _ = require('lodash');

const EndpointBuilder = require('./endpoint-builder');
const EndpointChecker = require('./endpoint-checker');
const PostDataGenerator = require('./post-data-generator');

const Validator = function(api, target, validateResponse) {

    this.api = api;
    this.target = target;
    this.validateResponse = validateResponse;

    this.endpointBuilder = new EndpointBuilder();
    this.postDataGenerator = new PostDataGenerator();

    this.endpointChecker = new EndpointChecker();

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
                const methodName = method.method();

                let postData = {};
                if (methodName  === 'post') postData = this.postDataGenerator.generate(method);

                endpointToTest = this.endpointBuilder.addQueryParams(endpointToTest, method.queryParameters());

                let apiHeaders = {};
                if (method.headers().length > 0) apiHeaders = this.endpointBuilder.parseHeaders(method.headers());

                const expectedResponses = method.responses();

                this.endpointChecker.check(
                    endpointToTest,
                    methodName,
                    apiHeaders,
                    expectedResponses,
                    postData,
                    validateResponse
                ).then(() => {
                    let headers = '';

                    if (Object.keys(apiHeaders).length > 0)
                        headers = ' - headers: ' + JSON.stringify(apiHeaders);
                    
                    console.log('[OK][' + methodName + '] ' + endpointToTest + headers);
                    if (!_.isEmpty(postData)) console.log('    With body: ' + JSON.stringify(postData));
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

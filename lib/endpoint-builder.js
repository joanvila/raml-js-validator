'use strict';

const config = require('../config');
const paramMappings = require('./param-mappings');

const EndpointBuilder = function() {

    this.buildUnparsedUri = (target, resource) => {
        let result = '';
        const absoluteUri = resource.absoluteUri();
        const completeRelativeUri = resource.completeRelativeUri();

        if (typeof(target) ===  'undefined') {
            if (absoluteUri !== completeRelativeUri) {
                // raml baseUri specified
                result = absoluteUri;
            } else {
                // raml baseUri not specified, taking default one
                result = config.defaultEndpoint.replace(/\/$/, '') + absoluteUri;
            }
        } else {
            // raml baseUri ignored present or not and taking the target one
            result = target.replace(/\/$/, '') + completeRelativeUri;
        }

        return result;
    };

    this.parseUriWithParameters = (resourceUri, uriParameters) => {
        let paramNumber = 0;

        while (paramNumber < uriParameters.length) {
            const paramType = uriParameters[paramNumber].type();
            const replace = String(paramMappings.get(paramType));

            let paramStartIndex = resourceUri.indexOf('{');
            let paramEndIndex = resourceUri.indexOf('}');

            // Remove param placeholder
            let uriArray = resourceUri.split('');
            uriArray.splice(paramStartIndex, paramEndIndex + 1 - paramStartIndex);
            resourceUri = uriArray.join('');

            // Insert a valid param into the placeholder position
            resourceUri = [resourceUri.slice(0, paramStartIndex), replace, resourceUri.slice(paramStartIndex)].join('');

            ++paramNumber;
        }

        return resourceUri;

    };

    this.addQueryParams = (baseUri, queryParams) => {

        let addedFirstOne = false;

        queryParams.forEach((queryParam) => {
            if (queryParam.example()) {
                if (!addedFirstOne) {
                    baseUri += '?' + queryParam.name() + '=' + queryParam.example().value();
                    addedFirstOne = true;
                } else {
                    baseUri += '&' + queryParam.name() + '=' + queryParam.example().value();
                }
            }
        });

        return baseUri;
    };
};

module.exports = EndpointBuilder;

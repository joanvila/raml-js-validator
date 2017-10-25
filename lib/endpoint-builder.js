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
            let paramStartIndex = resourceUri.indexOf('{');
            let paramEndIndex = resourceUri.indexOf('}');

            // Remove param placeholder
            let uriArray = resourceUri.split('');
            uriArray.splice(paramStartIndex, paramEndIndex + 1 - paramStartIndex);
            resourceUri = uriArray.join('');

            let validParamValue = getValidParamValue(uriParameters[paramNumber]);
            resourceUri = [resourceUri.slice(0, paramStartIndex), validParamValue , resourceUri.slice(paramStartIndex)].join('');

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

    this.parseHeaders = (headers) => {
        let headersMap = {};
        headers.forEach(function(header) {
            if (header.example())
                headersMap[header.displayName()] = header.example().value();    
        });

        return headersMap;
    };

    function getValidParamValue(param) {
        let validParamValue = '';

        if (param.example()) {
            validParamValue = param.example().value();
        } else {
            // The available mapping
            const paramType = param.type();
            validParamValue = String(paramMappings.get(paramType));
        }

        return validParamValue;
    }

};

module.exports = EndpointBuilder;

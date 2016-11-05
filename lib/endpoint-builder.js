'use strict';

const config = require('../config');
const paramMappings = require('./param-mappings');


const buildUnparsedUri = function(target, resource) {
    let result = '';
    let absoluteUri = resource.absoluteUri();
    let completeRelativeUri = resource.completeRelativeUri();

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

const parseUriWithParameters = function(resourceUri, uriParameters) {
    let paramNumber = 0;

    while (paramNumber < uriParameters.length) {
        let paramType = uriParameters[paramNumber].type();
        let replace = String(paramMappings.get(paramType));

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

exports.parseUriWithParameters = parseUriWithParameters;
exports.buildUnparsedUri = buildUnparsedUri;

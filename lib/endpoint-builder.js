'use strict';

const config = require('../config');
const paramMappings = require('./param-mappings');

const build = function(target, resourceUri, uriParameters) {
    if (typeof(target) ===  'undefined') {
        target = config.defaultEndpoint;
    }

    target = target.replace(/\/$/, '');
    let fullUri = target + resourceUri;

    let paramNumber = 0;

    while (paramNumber < uriParameters.length) {
        let paramType = uriParameters[paramNumber].type();
        let replace = String(paramMappings.get(paramType));

        let paramStartIndex = fullUri.indexOf('{');
        let paramEndIndex = fullUri.indexOf('}');

        // Remove param placeholder
        let uriArray = fullUri.split('');
        uriArray.splice(paramStartIndex, paramEndIndex + 1 - paramStartIndex);
        fullUri = uriArray.join('');

        // Insert a valid param into the placeholder position
        fullUri = [fullUri.slice(0, paramStartIndex), replace, fullUri.slice(paramStartIndex)].join('');

        ++paramNumber;
    }

    return fullUri;

};

exports.build = build;

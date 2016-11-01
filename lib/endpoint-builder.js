'use strict';

const config = require('../config');

let buildBaseEndpoint = function(target, resourceUri) {
    if (typeof(target) ===  'undefined') {
        target = config.defaultEndpoint;
    }

    target = target.replace(/\/$/, '');
    return target + resourceUri;
}

exports.buildBaseEndpoint = buildBaseEndpoint;

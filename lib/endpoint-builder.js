'use strict';

const config = require('../config');

const buildBaseEndpoint = function(target, resourceUri) {
    if (typeof(target) ===  'undefined') {
        target = config.defaultEndpoint;
    }

    target = target.replace(/\/$/, '');
    return target + resourceUri;
};

exports.buildBaseEndpoint = buildBaseEndpoint;

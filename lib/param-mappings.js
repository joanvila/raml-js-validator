'use strict';

const get = function(type) {
    const mappings = {
        'string': 'stringParam'
    };

    return mappings[type];
};

exports.get = get;

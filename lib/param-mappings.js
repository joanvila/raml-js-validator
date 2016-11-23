'use strict';

const get = (type) => {
    const mappings = {
        'string': 'string',
        'number': 1
    };

    if (!mappings.hasOwnProperty(type)) return 'unknown';
    return mappings[type];
};

exports.get = get;

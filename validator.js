'use strict';

var request = require('request');
const config = require('./config');

function buildEndpoint(target, resourceUri) {
    if (typeof(target) ===  'undefined') {
        target = config.defaultEndpoint;
    }

    target = target.replace(/\/$/, '');
    return target + resourceUri;
}

let Validator = function(api, target) {

    this.api = api;
    this.target = target;

    this.validate = function() {
        let apiResources = this.api.resources();

        apiResources.forEach( (resource) => {
            console.log(resource.kind() + " : " + resource.absoluteUri());
            let endpointToTest = buildEndpoint(this.target, resource.absoluteUri());
            console.log(endpointToTest);

            request(endpointToTest, (error, response, body) => {
                if (error) throw error;
                else if (response.statusCode !== 200) throw '  Non ok response code received';
                else console.log('  OK');
            });
        });
    }
}

module.exports = Validator;

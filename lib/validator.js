'use strict';

const request = require('request');
const endpointBuilder = require('./endpoint-builder');

let Validator = function(api, target) {

    this.api = api;
    this.target = target;

    this.validate = function() {
        let apiResources = this.api.resources();

        apiResources.forEach( (resource) => {
            console.log(resource.kind() + ' : ' + resource.absoluteUri());
            let endpointToTest = endpointBuilder.buildBaseEndpoint(
                this.target, resource.absoluteUri());

            console.log('Querying ' + endpointToTest + '...');

            request(endpointToTest, (error, response, body) => {
                if (error) throw error;
                else if (response.statusCode !== 200) throw 'Non ok response code received';
                else console.log('Resource OK');
            });
        });
    };
}

module.exports = Validator;

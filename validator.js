'use strict';

let Validator = function(api) {

    this.api = api;

    this.validate = function() {
        let apiResources = this.api.resources();

        apiResources.forEach( (resource) => {
            console.log(resource.kind() + " : " + resource.absoluteUri());
        });
    }
}

module.exports = Validator;

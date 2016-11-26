'use strict';

const PostDataGenerator = function() {

    this.generate = (method) => {
        let formData = {};
        let properties = {};

        try {
            properties = method.toJSON().body['application/x-www-form-urlencoded'].properties;
        } catch(err) {
            return {};
        }

        for (let property in properties) {
            formData[properties[property].name] = properties[property].example;
        }

        return formData;
    };
};

module.exports = PostDataGenerator;

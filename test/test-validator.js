'use strict';

const Q = require('q');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");

chai.should();
chai.use(sinonChai);

const Validator = require('../lib/validator');

describe('validator', () => {

    const apiMock = {
        resources: function() {
            return [{
                allUriParameters: function() {
                    return ['param'];
                },
                methods: function() {
                    return [{
                        method: function() {
                            return 'get';
                        },
                        responses: function() {
                            return [{
                                code: function() {
                                    return {
                                        value: function () {
                                            return 200;
                                        }
                                    };
                                }
                            }];
                        }
                    }];
                }
            }];
        }
    };

    let validator = new Validator(apiMock, undefined);

    before(() => {

        sinon.stub(
            validator.endpointBuilder,
            'buildUnparsedUri',
            function() {return 'prettyUrl';});

        sinon.stub(
            validator.endpointBuilder,
            'parseUriWithParameters',
            function() {return 'prettyParsedUrl';});

        sinon.stub(
            validator.endpointChecker,
            'check',
            function() {return Q.defer().promise});
    });

    after(() => {
        validator.endpointBuilder.buildUnparsedUri.restore();
        validator.endpointBuilder.parseUriWithParameters.restore();
        validator.endpointChecker.check.restore();
    });

    it('should validate', () => {
        validator.validate();
        validator.endpointChecker.check.should.have.been.calledWith('prettyParsedUrl', 'get');
        // TODO: Check number of calls and an error response
    });

});

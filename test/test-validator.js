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
                            }, {
                                code: function() {
                                    return {
                                        value: function () {
                                            return 999;
                                        }
                                    };
                                }
                            }];
                        },
                        queryParameters: function() {
                            return 'param';
                        },
                        headers: function() {
                            return [];
                        }
                    }, {
                        method: function() {
                            return 'post';
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
                        },
                        queryParameters: function() {
                            return 'param';
                        },
                        headers: function() {
                            return [{
                                displayName: function() {return 'header1';},
                                example: function() {
                                    return {
                                    value: function() {
                                        return 'value1';
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

    const validator = new Validator(apiMock, undefined, false);

    const postDataGeneratorResponse = {name: 'Code things', owner: 'Joan'};

    const parseHeadersResponse = {header1: 'value1'};

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
            validator.endpointBuilder,
            'addQueryParams',
            function() {return 'prettyParsedUrl&param=1';});

        sinon.stub(
            validator.endpointBuilder,
            'parseHeaders',
            function() {return parseHeadersResponse;});

        sinon.stub(
            validator.postDataGenerator,
            'generate',
            function() {return postDataGeneratorResponse;});

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

        validator.endpointChecker.check.should.have.been.calledTwice;

        validator.endpointChecker.check.should.have.been.calledWith(
            'prettyParsedUrl&param=1', 'get', {}, sinon.match.any, {}, false);

        validator.endpointChecker.check.should.have.been.calledWith(
            'prettyParsedUrl&param=1', 'post', parseHeadersResponse, sinon.match.any, postDataGeneratorResponse, false);
    });

});

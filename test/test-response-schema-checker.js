'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const ResponseSchemaChecker = require('../lib/response-schema-checker')

describe('response-schema-checker', () => {

    const responseSchemaChecker = new ResponseSchemaChecker();

    describe('check() no expected response', () => {

        it('should return a valid result with a notice', () => {
            expect(responseSchemaChecker.check([], {}))
            .to.deep.equal({
                valid: true, validationErrorReason: 'no body'
            });
        });

    });

    describe('check() empty body', () => {

        const mockEmptyBodyExpectedResp = [{
            code: function() {
                return {
                    value: function() {return 200;}
                };
            },
            body: function() {
                return [];
            }
        }];

        const mockResponse = {
            statusCode: 200
        }

        it('should return a valid result with a notice', () => {
            expect(responseSchemaChecker.check(mockEmptyBodyExpectedResp, mockResponse))
            .to.deep.equal({
                valid: true, validationErrorReason: 'no body'
            });
        });

    });

    describe('check() simple body', () => {

        const mockBodyExpectedResp = [{
            code: function() {
                return {
                    value: function() {return 200;}
                };
            },
            body: function() {
                return [{
                    type: function() {return ['object'];}
                }];
            }
        }];

        const mockGoodResponse = {
            statusCode: 200,
            body: '{"result": 42}'
        };

        const mockBadResponse = {
            statusCode: 200,
            body: 42
        };

        it('should return a valid result when schema matches with simple response type', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockGoodResponse))
            .to.deep.equal({
                valid: true, validationErrorReason: ''
            });
        });

        it('should return an invalid result when the schema do not match with simple response type', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockBadResponse))
            .to.deep.equal({
                valid: false, validationErrorReason: 'object !== number'
            });
        });

    });

    describe('check() complex body', () => {

        const mockBodyExpectedResp = [{
            code: function() {
                return {
                    value: function() {return 200;}
                };
            },
            body: function() {
                return [{
                    type: function() {return ['ComplexObject'];},
                    toJSON: function() {
                        return {
                            example: {
                                key: 'value'
                            }
                        }
                    }
                }];
            }
        }];

        const mockGoodResponse = {
            statusCode: 200,
            body: '{"key": 42}'
        };

        const mockBadResponse = {
            statusCode: 200,
            body: '{"badKey": 42}'
        };

        it('should return a valid result when schema matches with complex response keys', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockGoodResponse))
            .to.deep.equal({
                valid: true, validationErrorReason: ''
            });
        });

        it('should return an invalid result when the schema do not match with complex response keys', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockBadResponse))
            .to.deep.equal({
                valid: false, validationErrorReason: 'Response differs: \n' +
                '        Expected keys: [ key ]\n' +
                '        Received from API: [ badKey ]'
            });
        });
    });

    describe('check() complex body without example provided', () => {

        const mockBodyExpectedResp = [{
            code: function() {
                return {
                    value: function() {return 200;}
                };
            },
            body: function() {
                return [{
                    type: function() {return ['ComplexObject'];},
                    toJSON: function() {
                        return {};
                    }
                }];
            }
        }];

        const mockResponse = {
            statusCode: 200,
            body: '{"key": 42}'
        };

        it('should return an invalid result when the example is not present in the raml specification', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockResponse))
            .to.deep.equal({
                valid: false, validationErrorReason: 'No example provided in the RAML file'
            });
        });
    });
});

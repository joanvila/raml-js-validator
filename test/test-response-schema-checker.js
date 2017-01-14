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

    describe('check() body', () => {

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

        it('should return a valid result when schema matches', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockGoodResponse))
            .to.deep.equal({
                valid: true, validationErrorReason: ''
            });
        });

        it('should return an invalid result when the schema do not match', () => {
            expect(responseSchemaChecker.check(mockBodyExpectedResp, mockBadResponse))
            .to.deep.equal({
                valid: false, validationErrorReason: 'object !== number'
            });
        });

    });
});

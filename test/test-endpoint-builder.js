'use strict';

const assert = require('chai').assert;
const EndpointBuilder = require('../lib/endpoint-builder');

const paramMappings = require('../lib/param-mappings');
const sinon = require('sinon');

describe('endpoint-builder', () => {

    const endpointBuilder = new EndpointBuilder();

    describe('buildUnparsedUri()', () => {

        const mockResourceNoBaseuri = {
            absoluteUri: function() {return '/resource';},
            completeRelativeUri: function() {return '/resource';}
        };

        const mockResourceWithBaseuri = {
            absoluteUri: function() {return 'http://baseuri/resource';},
            completeRelativeUri: function() {return '/resource';}
        };

        it('should strip the ending slash on the target', () => {
            assert.equal(
                endpointBuilder.buildUnparsedUri('http://target/', mockResourceNoBaseuri),
                'http://target/resource');
        });

        it('target specified and no baseUri in the resource', () => {
            assert.equal(
                endpointBuilder.buildUnparsedUri('http://target', mockResourceNoBaseuri),
                'http://target/resource');
        });

        it('target specified and baseUri in the resource', () => {
            assert.equal(
                endpointBuilder.buildUnparsedUri('http://target', mockResourceWithBaseuri),
                'http://target/resource');
        });

        it('target not specified and no baseUri in the resource', () => {
            assert.equal(
                endpointBuilder.buildUnparsedUri(undefined, mockResourceNoBaseuri),
                'http://localhost:8080/resource');
        });

        it('target not specified and baseUri in the resource', () => {
            assert.equal(
                endpointBuilder.buildUnparsedUri(undefined, mockResourceWithBaseuri),
                'http://baseuri/resource');
        });
    });

    describe('parseUriWithStringParameters()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() { return 'a'; });
        });

        after(() => {
            paramMappings.get.restore();
        });

        const mockParam = {
            type: function() {return typeof('string');},
            example: function() {return null;}
        };

        it('should return a parsed uri with a param replaced', () => {
            assert.equal(
                endpointBuilder.parseUriWithParameters(
                    'http://target.com/resource/{testParam}', [mockParam]),
                'http://target.com/resource/a');
        });

        it('should return a parsed uri with more than one param replaced', () => {
            assert.equal(
                endpointBuilder.parseUriWithParameters(
                    'http://target.com/resource/{testParam}/{anotherTestParam}', [mockParam, mockParam]),
                'http://target.com/resource/a/a');
        });

    });

    describe('parseUriWithIntParameters()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() { return 1; });
        });

        after(() => {
            paramMappings.get.restore();
        });

        const mockParam = {
            type: function() {return typeof(1);},
            example: function() {return null;}
        };

        it('should return a parsed uri with an integer type param', () => {
            assert.equal(
                endpointBuilder.parseUriWithParameters(
                    'http://target.com/resource/{testParam}/{anotherTestParam}', [mockParam, mockParam]),
                'http://target.com/resource/1/1');
        });

    });

    describe('parseUriWithStringParametersWithExample()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() { return 'a'; });
        });

        after(() => {
            paramMappings.get.restore();
        });

        const mockParam = {
            type: function() {return typeof('string');},
            example: function() {return null;}
        };

        const mockParamWithExample = {
            type: function() {return typeof('string');},
            example: function() {
                return {
                    value: function() {return 'example';}
                };
            }
        };

        it('should return a parsed uri with an example param replaced', () => {
            assert.equal(
                endpointBuilder.parseUriWithParameters(
                    'http://target.com/resource/{testParam}', [mockParamWithExample]),
                'http://target.com/resource/example');
        });

        it('should return a parsed uri with mixed params and example params replaced', () => {
            assert.equal(
                endpointBuilder.parseUriWithParameters(
                    'http://target.com/resource/{testParam}/{anotherTestParam}', [mockParamWithExample, mockParam]),
                'http://target.com/resource/example/a');
        });

    });

    describe('addQueryParams()', () => {

        const mockQueryParams = [{
            name: function() {return 'param1';},
            example: function() {
                return {
                    value: function() {
                        return 'exampleValue1';
                    }
                };
            }
        }, {
            name: function() {return 'param2';},
            example: function() {return null;}
        }, {
            name: function() {return 'param3';},
            example: function() {
                return {
                    value: function() {
                        return 'exampleValue3';
                    }
                };
            }
        }];

        it('should build the query params part of the url', () => {
            assert.equal(
                endpointBuilder.addQueryParams(
                    'baseUri', mockQueryParams),
                'baseUri?param1=exampleValue1&param3=exampleValue3');
        });

    });

     describe('parseHeaders()', () => {

        it('should return a parsed header as an object to use in the request npm module', () => {

            const mockParam = [{
                displayName: function() {return 'header1';},
                example: function() {
                    return {
                    value: function() {
                        return 'value1';
                    }
                };
            }
            },{
                displayName: function() {return 'header2';},
                example: function() {
                    return {
                    value: function() {
                        return 'value2';
                    }
                };
            }
            }];

            assert.deepEqual(
                endpointBuilder.parseHeaders(mockParam),
                {'header1': 'value1', 'header2': 'value2'});
        });

        it('should return an empty object if "headers" contains invalid data', () => {

            const mockParam = {
                displayName: function() {return 'header1';},
                example: function() {return null;}
            };

            assert.deepEqual(
                endpointBuilder.parseHeaders(
                    [mockParam]), {});
        });

        it('should return an empty object if there are no headers', () => {

            assert.deepEqual(
                endpointBuilder.parseHeaders([]), {});
        });

    });

});

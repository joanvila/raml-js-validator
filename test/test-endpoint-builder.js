'use strict';

const assert = require('chai').assert;
const endpointBuilder = require('../lib/endpoint-builder');

const paramMappings = require('../lib/param-mappings');
const sinon = require('sinon');

describe('endpoint-builder', () => {
    describe('buildWithoutParameters()', () => {

        it('should return localhost when no target specified', () => {
            assert.equal(
                endpointBuilder.build(undefined, '/resource', []),
                'http://localhost:8080/resource');
        });

        it('should return the target specified plus the resource', () => {
            assert.equal(
                endpointBuilder.build('http://target', '/resource', []),
                'http://target/resource');
        });

        it('should strip the ending slash on the target', () => {
            assert.equal(
                endpointBuilder.build('http://target/', '/resource', []),
                'http://target/resource');
        });

    });

    describe('buildWithStringParameters()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() { return 'a'; });
        });

        after(() => {
            paramMappings.get.restore();
        });

        let mockParam = { type: function() {return typeof('string');} }

        it('should return a parsed uri with a param replaced', () => {
            assert.equal(
                endpointBuilder.build(undefined, '/resource/{testParam}', [mockParam]),
                'http://localhost:8080/resource/a');
        });

        it('should return a parsed uri with more than one param replaced', () => {
            assert.equal(
                endpointBuilder.build(undefined, '/resource/{testParam}/{anotherTestParam}', [mockParam, mockParam]),
                'http://localhost:8080/resource/a/a');
        });

    });

    describe('buildWithIntParameters()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() { return 1; });
        });

        after(() => {
            paramMappings.get.restore();
        });

        let mockParam = { type: function() {return typeof(1);} }

        it('should return a parsed uri with an integer type param', () => {
            assert.equal(
                endpointBuilder.build(undefined, '/resource/{testParam}/{anotherTestParam}', [mockParam, mockParam]),
                'http://localhost:8080/resource/1/1');
        });

    });
});

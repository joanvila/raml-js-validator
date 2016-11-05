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

    describe('buildWithParameters()', () => {

        before(() => {
            sinon.stub(paramMappings, 'get', function() {return 'a';});
        });

        after(() => {
            paramMappings.get.restore();
        });

        let mockStringParam = { type: function() {return typeof('string');} }

        it('should return a parsed uri rith a param replaced', () => {
            assert.equal(
                endpointBuilder.build(undefined, '/resource/{testParam}', [mockStringParam]),
                'http://localhost:8080/resource/a');
        });

    });

});

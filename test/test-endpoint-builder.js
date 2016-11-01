'use strict';

const assert = require('chai').assert;
const endpointBuilder = require('../lib/endpoint-builder');

describe('endpoint-builder', () => {
    describe('buildBaseEndpoint()', () => {

        it('should return localhost when no target specified', () => {
            assert.equal(
                endpointBuilder.buildBaseEndpoint(undefined, '/resource'),
                'http://localhost:8080/resource');
        });

        it('should return the target specified plus the resource', () => {
            assert.equal(
                endpointBuilder.buildBaseEndpoint('http://target', '/resource'),
                'http://target/resource');
        });

        it('should strip the ending slash on the target', () => {
            assert.equal(
                endpointBuilder.buildBaseEndpoint('http://target/', '/resource'),
                'http://target/resource');
        });

    });
});

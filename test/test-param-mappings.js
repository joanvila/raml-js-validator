'use strict';

const assert = require('chai').assert;
const paramMappings = require('../lib/param-mappings');

describe('param-mappings', () => {
    describe('get() types', () => {

        it('should return a string when asking for it', () => {
            assert.equal(
                paramMappings.get(typeof('string')),
                'string');
        });

        it('should return an integer when asking for it', () => {
            assert.equal(
                paramMappings.get(typeof(1)),
                1);
        });

        it('should return unknown sring  when asking for something else', () => {
            assert.equal(
                paramMappings.get(typeof(undefined)),
                'unknown');
        });
    });

});


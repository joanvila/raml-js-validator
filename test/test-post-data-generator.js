'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const PostDataGenerator = require('../lib/post-data-generator');

const sinon = require('sinon');

describe('endpoint-builder', () => {

    const postDataGenerator = new PostDataGenerator();

    describe('generate()', () => {

        const mockMethod = {
            toJSON: function() {
                return {
                    body: {
                        'application/x-www-form-urlencoded': {
                            properties: [{
                                name: 'exampleName1',
                                example: 'exampleValue1'
                            },{
                                name: 'exampleName2',
                                example: 'exampleValue2'
                            }]
                        }
                    }
                };
            }
        };

        const mockMethodWithNoBody = {
            toJSON: function() {
                return {
                    body: null
                };
            }
        };

        it('should generate the post body data from a post method object', () => {
            const postDataGenerated = postDataGenerator.generate(mockMethod);
            const expectedPostData = {
                exampleName1: 'exampleValue1',
                exampleName2: 'exampleValue2'
            };

            for (let postKey in expectedPostData) {
                assert.equal(expectedPostData[postKey], postDataGenerated[postKey]);
            }

        });

        it('should return empty object when no body parameters specified', () => {
            const postDataGenerated = postDataGenerator.generate(mockMethodWithNoBody);
            expect(postDataGenerated).to.deep.equal({});
        });

    });

});

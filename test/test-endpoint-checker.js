'use strict';

const chaiAsPromised = require("chai-as-promised");
const chai = require('chai');
chai.use(chaiAsPromised);
const expect = chai.expect;

const EndpointChecker = require('../lib/endpoint-checker');

describe('endpoint-checker', () => {
    describe('check()', () => {

        const endpointChecker = new EndpointChecker();

        it('should accept promise on 200 code', () => {
            return expect(endpointChecker.check('http://www.google.com')).to.eventually
              .equal('Resource OK');
        });

        it('should reject promise with error on non 200 code', () => {
            return expect(endpointChecker.check('http://localhost:0')).to.eventually
              .be.rejectedWith('Received a non 200 error code')
              .and.be.an.instanceOf(Error);
        });

    });
});



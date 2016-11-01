'use strict';

const chaiAsPromised = require("chai-as-promised");
const chai = require('chai');
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require('sinon');

const request = require('request');
const EndpointChecker = require('../lib/endpoint-checker');

describe('endpoint-checker', () => {

    const endpointChecker = new EndpointChecker();

    describe('check() good endpoint', () => {

        before(() => {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 200}, {});
        });

        after(() => {
            request.get.restore();
        });


        it('should accept promise on 200 code', () => {
            return expect(endpointChecker.check('http://www.google.com')).to.eventually
              .equal('Resource OK');
        });

    });

    describe('check() bad endpoint', () => {

        before(() => {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 500}, {});
        });

        after(() => {
            request.get.restore();
        });

        it('should reject promise with error', () => {
            return expect(endpointChecker.check('http://localhost:0')).to.eventually
              .be.rejectedWith('Received a non 200 error code')
              .and.be.an.instanceOf(Error);
        });

    });

});



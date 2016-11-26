'use strict';

const sinon = require('sinon');
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");
const chai = require('chai');
const expect = chai.expect;

const request = require('request');
const EndpointChecker = require('../lib/endpoint-checker');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

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
            return expect(endpointChecker.check('http://localhost:80', 'get', [200], {})).to.eventually
              .equal('Resource OK');
        });

        it('should check default response code when no one specified', () => {
            return expect(endpointChecker.check('http://localhost:80', 'get', [], {})).to.eventually
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
            return expect(endpointChecker.check('http://localhost:80', 'get', [200], {})).to.eventually
              .be.rejectedWith('[ERROR][get] http://localhost:80')
              .and.be.an.instanceOf(Error);
        });

        it('should accept if the expected code is 500', () => {
            return expect(endpointChecker.check('http://localhost:80', 'get', [200, 500], {})).to.eventually
              .equal('Resource OK');
        });

    });

    describe('check() post method', () => {

        const postDataMock = {name: 'Code things', owner: 'Joan'};

        before(() => {
            sinon
                .stub(request, 'post')
                .yields(null, {statusCode: 200}, {});
        });

        after(() => {
            request.post.restore();
        });

        it('should return a 200 when sending a post', () => {
            return expect(endpointChecker.check('http://localhost:80', 'post', [200], {})).to.eventually
              .equal('Resource OK');
        });

        it('should send the post data when it is not empty', () => {
            endpointChecker.check('http://localhost:80', 'post', [200], postDataMock);

            request.post.should.have.been.calledWith(
                'http://localhost:80', {form: postDataMock});
        });

    });
});

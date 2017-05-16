'use strict';

const assert = require('assert');
const session = require('..')();

describe('store', () => {
    it('create valid entry in session store', done => {
        session.create('123', 'abc').then(ret => {
            assert.equal(ret, 'OK');
            done();
        });
    });

    it('get user id from session id 123', done => {
        session.getUserId('123').then(userId => {
            assert.equal(userId, 'abc');
            done();
        });
    });

    it('get session id from user id abc', done => {
        session.getSessionId('abc').then(sessionId => {
            assert.equal(sessionId, '123');
            done();
        });
    });

    it('check validity of session id 123', done => {
        session.check('123').then(userId => {
            assert.equal(userId, 'abc');
            done();
        });
    });

    it('check invalid session id 456', done => {
        session.check('456').then(userId => {
            assert.equal(userId, null);
            done();
        });
    });

    it('delete session id 123', done => {
        session.drop('123').then(ret => {
            assert.equal(ret, 1);
            done();
        });
    });

    it('check invalid session id 123', done => {
        session.check('123').then(userId => {
            assert.equal(userId, null);
            done();
        });
    });
});

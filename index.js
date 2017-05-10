'use strict';

class HttpSessionStore {

    constructor(host, port) {
        const bluebird = require('bluebird');
        const redis = require('redis');

        bluebird.promisifyAll(redis.RedisClient.prototype);

        this.cookieName = 'sid';
        this.uuid = require('uuid');
        this.cookie = require('cookie');

        this.client = redis.createClient(port || 6379, host || 'localhost', { no_ready_check: true });

        if (config.password) {
            this.client.auth('password', function (err) {
                if (err) throw err;
            });
        }

        this.client.on('connect', function () {
            console.log('Connected to Redis');
        });
    }

    check(req) {
        const cookies = this.cookie.parse(req.headers.cookie || '');
        var sessionId = cookies[this.cookieName];

        // use string to prevent redis warning
        return this.client.getAsync(sessionId || 'undefined');
    }

    set(res, uid) {
        const options = {
            httpOnly: true
        };

        // Generate a RFC4122 UUID (random) -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
        const sessionId = this.uuid();

        this.client.set(sessionId, uid);
        res.cookie(this.cookieName, sessionId, options);
    }

    del(req) {
        const cookies = this.cookie.parse(req.headers.cookie || '');
        var sessionId = cookies[this.cookieName];

        this.client.del(sessionId);
    }
}

module.exports = HttpSessionStore;

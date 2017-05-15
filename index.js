'use strict';

class HttpSessionStore {

    constructor(host, port, password) {
        const redis = require('redis');
        const bluebird = require('bluebird');

        bluebird.promisifyAll(redis.RedisClient.prototype);

        this.idleTime = 360;
        this.maxTime = 3600;

        this.client = redis.createClient(port || 6379, host || 'localhost', { no_ready_check: true });

        if (password) {
            this.client.auth(password, (err) => {
                if (err) throw err;
            });
        }

        this.client.on('connect', () => {
            this.log('Connected to Redis');
        });
    }

    log(message) {
        if (process.env.NODE_ENV == 'test') {
            console.log(message);
        }
    }

    create(sessionId, userId) {
        return this.client.setAsync(sessionId, userId, 'EX', this.idleTime).then(ret => {
            return this.client.setAsync(userId, sessionId, 'EX', this.maxTime);
        });
    }

    check(sessionId) {
        return this.client.getAsync(sessionId).then(userId => {
            // prevent redis module warning
            return this.client.getAsync(userId || '').then(_sessionId => {
                if (sessionId === _sessionId) {
                    // refresh session entry
                    return this.client.setAsync(sessionId, userId, 'EX', this.idleTime).then(ret => {
                        return true;
                    });
                }
                else {
                    return false;
                }
            });
        });
    }

    delete(sessionId) {
        return this.client.getAsync(sessionId).then(userId => {
            return this.client.delAsync(sessionId).then((a) => {
                this.log('Entry session id deleted');
                return this.client.delAsync(userId);
            });
        });
    }
}

module.exports = HttpSessionStore;

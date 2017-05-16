'use strict';

class HttpSessionStore {

    constructor(options) {
        const redis = require('redis');
        const bluebird = require('bluebird');

        bluebird.promisifyAll(redis.RedisClient.prototype);

        options = options || {};

        this.idleTime = options.idleTime || 360;
        this.maxTime = options.maxTime || 3600;

        this.client = redis.createClient(options.port || 6379, options.host || 'localhost', { no_ready_check: true });

        if (options.password) {
            this.client.auth(options.password, (err) => {
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

    getUserId(sessionId) {
        return this.client.getAsync(sessionId);
    };

    getSessionId(userId) {
        return this.client.getAsync(userId);
    };

    create(sessionId, userId) {
        return this.client.setAsync(sessionId, userId, 'EX', this.idleTime).then(() => {
            return this.client.setAsync(userId, sessionId, 'EX', this.maxTime);
        });
    }

    check(sessionId) {
        return this.client.getAsync(sessionId).then(userId => {
            // prevent redis module warning
            return this.client.getAsync(userId || '').then(_sessionId => {
                if (sessionId === _sessionId) {
                    // reset session idle timer
                    return this.client.setAsync(sessionId, userId, 'EX', this.idleTime).then(() => {
                        return userId;
                    });
                }
                else {
                    return null;
                }
            });
        });
    }

    drop(sessionId) {
        return this.client.getAsync(sessionId).then(userId => {
            return this.client.delAsync(sessionId).then((a) => {
                this.log('Entry session id deleted');
                return this.client.delAsync(userId);
            });
        });
    }
}

module.exports = (options) => {
    return new HttpSessionStore(options);
};

# HTTP Session Store

Simple package to use a Redis database a as session store for HTTP sessions.

For every session we store two key-value pairs `(sid,uid)` and `(uid,sid)`. Here `sid` is supposed to be a "cryptographically secure" session identifier, whereas `uid` denotes the user identifier of the session owner.

Using the method `create(<sid>,<uid>)` the corresponding key-value pairs are stored in the database. The first entry of the key-value pair `(sid,uid)` has a timeout set to `idleTime` seconds, such that the entry is automatically deleted after this timeout. The second entry `(uid,sid)` has a timeout set to `maxTime` seconds.
This setting is motivated by the idead that the timeout of the first key-value pair is reseted with every check of the session identifier `sid`, whereas the timeout of the second key-value pair is never reseted, denoting the absolut length of session. In order for the method `check(<sid>)` to return `true` (and to reset the session idle timer), both entries have to exist.


In the following code snippet we first create a pair of entries for session identifier `123` and user identifier `abc`, then check if the session is valid (and reset the idleTime), and finally get the user id associated with session identifier `123`.

```js
    const HttpSessionStore = require('http-session-store');
    const session = new HttpSessionStore();

    session.create('123', 'abc');

    session.check('123').then(valid => {
      console.log(valid); // output true
    });

    session.getUserId('123').then(uid => {
      console.log(uid); // output abc
    });
```

## Installation

```bash
$ npm i http-session-store
```

## Options

**const session = new HttpSessionStore([options]);**

| Property | Description                                                                           | Default     |
|----------|---------------------------------------------------------------------------------------|-------------|
| host     | Define host where redis database is running.                                          | "localhost" |   
| port     | Set port where redis databse is listening.                                            | 6379        | 
| password | If set, client will run Redis auth command on connect.                                |             | 
| idleTime | If there is no refresh call (method check), the session will be terminated. [seconds] | 360         |
| maxTime  | This is the maximum lifetime of a session. [seconds]                                  | 3600        |


## Tests
To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm i
$ npm test
```
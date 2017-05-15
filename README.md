# HTTP Session Store

Check if for a given session identifier there exists a user-id in the session db, if this is the case return the uid. 

```js
    const HttpSessionStore = require('http-session-store');
    const session = new HttpSessionStore();

    session.create('123', 'abc');

    session.check('123').then(uid => {
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
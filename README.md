# HTTP Session Store

check if for a given session identifier there exists a user-id in the session db, if this is the case return the uid 

  [![NPM Version][npm-image]][npm-url]

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

## Tests
To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm i
$ npm test
```
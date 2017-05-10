# HTTP Session Store

check if for a given session identifier there exists a user-id in the session db, if this is the case return the uid 


```
    const config = {
      hostname: 'localhost',
      port: 6379
    };

    const HttpSessionStore = require('http-session-store');
    const session = new HttpSessionStore(config);

    session.set(res, 'foo');

    session.check(req).then(uid => {
      console.info(uid);
    });
```

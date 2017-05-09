# HTTP Session Store

check if for a given session identifier there exists a user-id in the session db, if this is the case return the uid 


```
    const session = require('http-session-store');

    session.set(res, 'foo');

    session.check(req).then(uid => {
      console.log(uid);
    });
```

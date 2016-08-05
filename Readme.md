
# koa-redis-ratelimit

[![Slack Status][slack-image]][slack-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Code Coverage][codecoverage-image]][codecoverage-url]
[![Standard JS Style][standard-image]][standard-url]
[![MIT License][license-image]][license-url]

> Rate limiting middleware backed by Redis for Koa v2+, built for [CrocodileJS][crocodile-url].

---

**NOTE: Currently this package does not work due to an issue with `ratelimiter`, please use <https://github.com/scttcper/koa-simple-ratelimit> instead**

---

## Install

```bash
npm install --save koa-redis-ratelimit
```


## Usage

```js
import RateLimit from 'koa-redis-ratelimit';
import redis from 'redis';
import Koa from 'koa';

const app = new Koa();

// apply rate limit
app.use(new Ratelimit({
  db: redis.createClient(),
  duration: 60000,
  max: 100,
  id: (ctx) => ctx.ip,
  blacklist: [],
  whitelist: []
}).middleware);

// response middleware
app.use(ctx => {
  ctx.body = 'Stuff!';
});

app.listen(3000);
console.log('listening on port 3000');
```


## Options

* `db` - redis connection instance
* `max` - max requests within `duration` (default is `2500`)
* `duration` - of limit in milliseconds (default is `3600000`)
* `id` - id to compare requests [ip]
* `whitelist` - array of ids to whitelist
* `blacklist` - array of ids to blacklist


# Responses

> Example 200 with header fields:

```log
HTTP/1.1 200 OK
X-Powered-By: koa
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1384377793
Content-Type: text/plain; charset=utf-8
Content-Length: 6
Date: Wed, 13 Nov 2013 21:22:13 GMT
Connection: keep-alive

Stuff!
```

> Example 429 response:

```log
HTTP/1.1 429 Too Many Requests
X-Powered-By: koa
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1384377716
Content-Type: text/plain; charset=utf-8
Content-Length: 39
Retry-After: 7
Date: Wed, 13 Nov 2013 21:21:48 GMT
Connection: keep-alive

Rate limit exceeded, retry in 8 seconds
```


## License

[MIT][license-url]


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/koa-redis-ratelimit.svg
[npm-url]: https://npmjs.org/package/koa-redis-ratelimit
[crocodile-url]: https://crocodilejs.com
[standard-image]: https://img.shields.io/badge/code%20style-standard%2Bes7-brightgreen.svg
[standard-url]: https://github.com/crocodilejs/eslint-config-crocodile
[slack-image]: http://slack.crocodilejs.com/badge.svg
[slack-url]: http://slack.crocodilejs.com
[build-image]: https://semaphoreci.com/api/v1/niftylettuce/koa-redis-ratelimit/branches/master/shields_badge.svg
[build-url]: https://semaphoreci.com/niftylettuce/koa-redis-ratelimit
[codecoverage-image]: https://codecov.io/gh/niftylettuce/koa-redis-ratelimit/branch/master/graph/badge.svg
[codecoverage-url]: https://codecov.io/gh/niftylettuce/koa-redis-ratelimit

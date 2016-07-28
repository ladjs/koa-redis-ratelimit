
import Debug from 'debug';
import Limiter from 'ratelimiter';
import ms from 'ms';
import promisify from 'es6-promisify';

const debug = new Debug('koa-redis-ratelimit');

// Initialize ratelimit middleware with the given `opts`:
//  - `duration` limit duration in milliseconds [1 hour]
//  - `max` max requests per `id` [2500]
//  - `db` database connection
//  - `id` id to compare requests [ip]
//  - `whitelist` array of ids to whitelist
//  - `blacklist` array of ids to blacklist

export default class RateLimit {

  constructor(opts) {
    this.opts = opts || {};
  }

  middleware = async (ctx, next) => {

    const id = this.opts.id ? this.opts.id(ctx) : ctx.ip;

    if (id === false) return await next();

    // whitelist
    if (this.opts.whitelist && this.opts.whitelist.includes(id))
      return await next();

    // blacklist
    if (this.opts.blacklist && this.opts.blacklist.includes(id))
      return ctx.throw(403);

    // initialize limiter
    const limiter = new Limiter({
      ...this.opts,
      id: id
    });

    // check limit
    const limit = await promisify(limiter.get, limiter)();

    // check if current call is legit
    const remaining = limit.remaining > 0 ? limit.remaining - 1 : 0;

    // header fields
    ctx.set('X-RateLimit-Limit', limit.total);
    ctx.set('X-RateLimit-Remaining', remaining);
    ctx.set('X-RateLimit-Reset', limit.reset);

    debug('remaining %s/%s %s', remaining, limit.total, id);

    if (limit.remaining) return await next();

    const delta = (limit.reset * 1000) - Date.now() | 0;
    const after = limit.reset - (Date.now() / 1000) | 0;

    // <https://github.com/koajs/koa/issues/571#issuecomment-172976124>
    ctx.set('Retry-After', after);
    ctx.status = 429;
    ctx.body = `Rate limited exceeded, retry in ${ms(delta, { long: true })}`;

  }

}

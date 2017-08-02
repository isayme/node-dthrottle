## dthrottle

[![Build Status](https://travis-ci.org/isayme/node-dthrottle.svg?branch=master)](https://travis-ci.org/isayme/node-dthrottle)
[![Coverage Status](https://coveralls.io/repos/github/isayme/node-dthrottle/badge.svg?branch=master)](https://coveralls.io/github/isayme/node-dthrottle?branch=master)

## How it works
**Rate limit the invocation of a function by `ignore` following invocations.**

## Example
```
const redis = require('redis')
const dthrottle = require('dthrottle')

function tested () {
  console.log(new Date().toISOString(), 'executing ...')
}

let test = dthrottle(tested, {
  wait: 1000,
  adapter: new dthrottle.Adapters.Redis({
    throttle: 2,
    redis: redis.createClient(),
    prefix: 'dthrottle:example'
  })
})

// even `test` invoked every 100ms, `tested` invoked every 1000ms
setInterval(() => {
  test()
}, 100)
```

## Doc
### dthrottle(func, opts)
* `func`, the function to be ratelimited
* `opts.wait`, invoke the `func` after `opts.wait` ms
* `opts.adapter`, adapter to be used
* `opts.getId`, the function to generate `identify id` to seprate invocations of `func`
* `opts.error`, callback that will invoked when `opts.adapter` failed


### Adapters

#### new dthrottle.Adapters.Memory(opts)
* `opts.expire`, expire seconds for any locked `identify id`

#### new dthrottle.Adapters.Redis(opts)
* `opts.expire`, expire seconds for any locked `identify id`
* `opts.redis`, [node_redis](https://github.com/NodeRedis/node_redis) client
* `opts.prefix`, add prefix for keys to be used in dthrottle

### Add another Adapter
An adapter should have at least two methods: `setnx` and `clear`, both return a Promise.

##### keep the `adapter.setnx` atomic
On any invocation, An adapter should lock the `identify id` to ignore later invocations.

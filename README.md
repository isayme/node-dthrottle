## DFRL

[![Build Status](https://travis-ci.org/isayme/node-dfrl.svg?branch=master)](https://travis-ci.org/isayme/node-dfrl)
[![Coverage Status](https://coveralls.io/repos/github/isayme/node-dfrl/badge.svg?branch=master)](https://coveralls.io/github/isayme/node-dfrl?branch=master)

`D`istribute `F`unction `R`ate `L`limit.

## How it works
** Rate limit the invocation of a function by `ignore` following invocations. **


## Example
````
const redis = require('redis')
const dfrl = require('dfrl')

function tested () {
  console.log(new Date().toISOString(), 'executing ...')
}

let test = dfrl(tested, {
  wait: 1000,
  adapter: new dfrl.Adapters.Redis({
    throttle: 2,
    redis: redis.createClient(),
    prefix: 'dfrl:example'
  })
})

// even `test` invoked every 100ms, `tested` invoked every 1000ms
setInterval(() => {
  test()
}, 100)
````

## Doc
### dfrl(func, opts)
* `func`, the function to be ratelimited
* `opts.wait`, invoke the `func` after `opts.wait` ms
* `opts.adapter`, adapter to be used
* `opts.getId`, the function to generate `identify id` to seprate invocations of `func`
* `opts.error`, callback that will invoked when `opts.adapter` failed


### Adapters

#### new dfrl.Adapters.Memory(opts)
* `opts.throttle`, expire seconds for any locked `identify id`

#### new dfrl.Adapters.Redis(opts)
* `opts.throttle`, expire seconds for any locked `identify id`
* `opts.redis`, [node_redis](https://github.com/NodeRedis/node_redis) client
* `opts.prefix`, add prefix for keys to be used in dfrl

### Add another Adapter
An adapter should have at least two methods: `setnx` and `clear`, both return a Promise.

##### keep the `adapter.setnx` atomic
On any invocation, An adapter should lock the `identify id` to ignore later invocations.

'use strict'

const redis = require('redis')
const dfrl = require('../lib')

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

setInterval(() => {
  test()
}, 100)

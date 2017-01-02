'use strict'

const expect = require('chai').expect
const Redis = require('../../lib/').Adapters.redis
const utils = require('../utils')
const redis = require('redis')

describe(`redis`, function () {
  let client = redis.createClient()
  let prefix = 'dfrl:prefix'

  describe('setnx', function () {
    it('should only one call success', function * () {
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Redis({
        throttle: 2,
        redis: client,
        prefix: prefix
      })

      let requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(adapter.setnx(id, timestamp))
      }

      let res = yield requests
      let sum = utils.sum(res)
      expect(sum).equal(1)

      yield (done) => client.del(`${prefix}:${id}`, done)
    })
  })

  describe('clear', function () {
    it('should return 1 when clear success', function * () {
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Redis({
        throttle: 2,
        redis: client,
        prefix: prefix
      })

      let res
      res = yield adapter.setnx(id, timestamp)
      expect(res).equal(1)

      res = yield adapter.clear(id)
      expect(res).equal(1)

      yield (done) => client.del(`${prefix}:${id}`, done)
    })

    it('should return 0 when clear fail', function * () {
      let id = 'uniqueId'
      let adapter = new Redis({
        throttle: 2,
        redis: client,
        prefix: prefix
      })

      let res
      res = yield adapter.clear(id)
      expect(res).equal(0)

      yield (done) => client.del(`${prefix}:${id}`, done)
    })
  })
})

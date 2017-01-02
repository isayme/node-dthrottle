'use strict'

const expect = require('chai').expect
const Redis = require('../../lib/').Adapters.redis
const utils = require('../utils')
const redis = require('redis')

describe(`redis`, function () {
  let client = redis.createClient()
  let prefix = 'dfrl:prefix'

  describe('constructor', function () {
    it('should throw opts.redis required', function () {
      let fn = () => new Redis()
      expect(fn).throw(Error, 'opts.redis required')
    })

    it('should throw opts.throttle required', function () {
      let fn = () => new Redis({redis: client})
      expect(fn).throw(Error, 'opts.throttle required')
    })

    it('should throw opts.prefix required', function () {
      let fn = () => new Redis({redis: client, throttle: 2})
      expect(fn).throw(Error, 'opts.prefix required')
    })
  })

  describe('setnx', function () {
    let id = 'uniqueId'

    afterEach(function * () {
      yield (done) => client.del(`${prefix}:${id}`, done)
    })

    it('should only one call success', function * () {
      let timestamp = Date.now()
      let adapter = new Redis({
        throttle: 2,
        redis: client,
        prefix: prefix
      })

      let requests = []
      for (let i = 0; i < 100; i++) {
        requests.push(adapter.setnx(id, timestamp))
      }

      let res = yield requests
      let sum = utils.sum(res)
      expect(sum).equal(1)
    })

    it('should able setnx after throttle', function * () {
      let timestamp = Date.now()
      let adapter = new Redis({
        throttle: 1,
        prefix: prefix,
        redis: client
      })

      let res
      res = yield adapter.setnx(id, timestamp)
      expect(res).equal(1)

      yield utils.delay(1000)

      res = yield adapter.setnx(id, Date.now())
      expect(res).equal(1)
    })
  })

  describe('clear', function () {
    let id = 'uniqueId'

    afterEach(function * () {
      yield (done) => client.del(`${prefix}:${id}`, done)
    })

    it('should able setnx after clear', function * () {
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

      res = yield adapter.setnx(id, timestamp)
      expect(res).equal(1)
    })

    it('should return 1 when clear success', function * () {
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
    })

    it('should return 0 when clear fail', function * () {
      let adapter = new Redis({
        throttle: 2,
        redis: client,
        prefix: prefix
      })

      let res
      res = yield adapter.clear(id)
      expect(res).equal(0)
    })
  })
})

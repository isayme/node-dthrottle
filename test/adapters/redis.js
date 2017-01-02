'use strict'

const expect = require('chai').expect
const Redis = require('../../lib/').Adapters.redis
const redis = require('redis')

describe(`redis`, function () {
  let client = redis.createClient()

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
})

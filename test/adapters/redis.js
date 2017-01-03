'use strict'

const expect = require('chai').expect
const sinon = require('sinon')
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

  describe('error', function () {
    let adapter = new Redis({
      redis: client,
      throttle: 1,
      prefix: 'dfrl:test'
    })

    it('should setnx should rejected when redis.eval have error', function * () {
      let stub = sinon.stub(adapter.redis, 'eval', function () {
        let callback = arguments[arguments.length - 1]

        callback(new Error('eval failed'))
      })

      let spy = sinon.spy()

      yield adapter.setnx('id', 1).catch(spy)

      expect(spy.callCount).equal(1)
      expect(spy.args[0][0].message).eql('eval failed')

      stub.restore()
    })

    it('should clear should rejected when redis.del have error', function * () {
      let stub = sinon.stub(adapter.redis, 'del', function () {
        let callback = arguments[arguments.length - 1]

        callback(new Error('del failed'))
      })

      let spy = sinon.spy()

      yield adapter.clear('id', 1).catch(spy)

      expect(spy.callCount).equal(1)
      expect(spy.args[0][0].message).eql('del failed')

      stub.restore()
    })
  })
})

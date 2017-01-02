'use strict'

const expect = require('chai').expect
const Memory = require('../../lib/').Adapters.memory
const utils = require('../utils')

describe(`memory`, function () {
  describe('constructor', function () {
    it('should throw if opts.throttle not defined', function () {
      let fn = () => new Memory()
      expect(fn).throw(Error, 'opts.throttle required')
    })
  })

  describe('setnx', function () {
    it('should only one call success', function * () {
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Memory({
        throttle: 2
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
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Memory({
        throttle: 1
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
    it('should able setnx after clear', function * () {
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Memory({
        throttle: 2
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
      let id = 'uniqueId'
      let timestamp = Date.now()
      let adapter = new Memory({
        throttle: 2
      })

      let res
      res = yield adapter.setnx(id, timestamp)
      expect(res).equal(1)

      res = yield adapter.clear(id)
      expect(res).equal(1)
    })

    it('should return 0 when clear fail', function * () {
      let id = 'uniqueId'
      let adapter = new Memory({
        throttle: 2
      })

      let res
      res = yield adapter.clear(id)
      expect(res).equal(0)
    })
  })
})

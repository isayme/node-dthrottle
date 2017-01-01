'use strict'

const sinon = require('sinon')
const expect = require('chai').expect
const dfrl = require('../lib/').dfrl
const Memory = require('../lib/').Adapters.memory
const utils = require('./utils')

describe('dfrl', function () {
  let wait = 100
  let adapter = new Memory({
    throttle: 200
  })

  describe('constructor', function () {
    it('should throw if first param not function', function () {
      let fn = () => dfrl('something')
      expect(fn).to.throw(Error, 'function required')
    })

    it('should throw if wait is undefined', function () {
      let fn = () => dfrl(function () {})
      expect(fn).to.throw(Error, 'opts.wait required')
    })

    it('should throw if adapter is undefined', function () {
      let fn = () => dfrl(function () {}, {wait: 500})
      expect(fn).to.throw(Error, 'opts.adapter required')
    })
  })

  describe('without getId', function () {
    it('should called once', function * () {
      let spy = sinon.spy()

      let worker = dfrl(spy, {
        wait: wait,
        adapter: adapter
      })

      for (let i = 0; i < 10; i++) {
        worker(`username${i}`)
      }

      yield utils.delay(200)
      expect(spy.callCount).equal(1)
      expect(spy.calledWith('username0')).be.true
    })
  })

  describe('with getId', function () {
    it('should called once with one id', function * () {
      let spy = sinon.spy()

      let worker = dfrl(spy, {
        wait: wait,
        adapter: adapter,
        getId: (username) => username
      })

      for (let i = 0; i < 10; i++) {
        worker('username')
      }

      yield utils.delay(200)
      expect(spy.callCount).equal(1)
      expect(spy.calledWith('username')).be.true
    })

    it('should called twice with two ids', function * () {
      let spy = sinon.spy()

      let worker = dfrl(spy, {
        wait: wait,
        adapter: adapter,
        getId: (username) => username
      })

      for (let i = 0; i < 10; i++) {
        worker(`username${i & 0x01}`, i)
      }

      yield utils.delay(200)
      expect(spy.callCount).equal(2)
      expect(spy.args[0]).eql(['username0', 0])
      expect(spy.args[1]).eql(['username1', 1])
    })
  })
})

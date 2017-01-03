'use strict'

const sinon = require('sinon')
const expect = require('chai').expect
const dfrl = require('../lib/')
const Memory = require('../lib/').Adapters.memory
const utils = require('./utils')

describe('dfrl', function () {
  let wait = 100
  let adapter = new Memory({
    throttle: 2
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

  describe('context for wrapped function', function () {
    it('should keep context', function * () {
      let spy = sinon.spy()
      let obj = {}

      let worker = dfrl(spy, {
        wait: wait,
        adapter: adapter
      })

      worker.call(obj)

      yield utils.delay(200)
      expect(spy.calledOn(obj)).be.true
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

  describe('error handle', function () {
    it('should catch when setnx rejected', function * () {
      let spy = sinon.spy()

      let worker = dfrl(function () {}, {
        wait: wait,
        adapter: adapter,
        error: spy
      })

      let stub = sinon.stub(adapter, 'setnx', function () {
        return new Promise((resolve, reject) => {
          reject(new Error('reject senex'))
        })
      })

      worker()

      yield utils.delay(200)

      expect(spy.callCount).equal(1)
      expect(spy.args[0][0].message).eql('reject senex')

      stub.restore()
    })

    it('should catch when clear rejected', function * () {
      let spy = sinon.spy()

      let worker = dfrl(function () {}, {
        wait: wait,
        adapter: adapter,
        error: spy
      })

      let stub = sinon.stub(adapter, 'clear', function () {
        return new Promise((resolve, reject) => {
          reject(new Error('reject clear'))
        })
      })

      worker()

      yield utils.delay(200)

      expect(spy.callCount).equal(1)
      expect(spy.args[0][0].message).eql('reject clear')

      stub.restore()
    })
  })
})

'use strict'

const expect = require('chai').expect
const Memory = require('../../lib/').Adapters.memory

describe(`memory`, function () {
  describe('constructor', function () {
    it('should throw if opts.throttle not defined', function () {
      let fn = () => new Memory()
      expect(fn).throw(Error, 'opts.throttle required')
    })
  })
})

'use strict'

const debug = require('debug')('dthrottle')

/*
 * rate limit a function
 *  opts.getId  generate unique id to identify different calls
 *  opts.wait   define wait time
 */
module.exports = function (func, opts) {
  let dthrottle = new DTHROTTLE(func, opts)

  return dthrottle.worker()
}

class DTHROTTLE {
  constructor (func, opts) {
    if (typeof func !== 'function') {
      throw new Error('function required')
    }

    opts = opts || {}

    this.func = func
    this.wait = opts.wait
    if (!this.wait) {
      throw new Error('opts.wait required')
    }

    this.adapter = opts.adapter
    if (!this.adapter) {
      throw new Error('opts.adapter required')
    }

    this.getId = opts.getId || function () { return 'undefined' }
    this.error = opts.error || console.log
  }

  /*
   * create new worker from origin worker
   */
  worker () {
    let self = this

    return function () {
      let args = Array.prototype.slice.apply(arguments)
      let id = self.getId.apply(this, args)
      let timestamp = Date.now()

      self.adapter.setnx(id, timestamp)
        .then(success => {
          if (success) {
            setTimeout(() => {
              debug(`called with: ${args}`)
              self.func.apply(this, args)
              self.adapter.clear(id).catch(self.error)
            }, self.wait)
          }
        }).catch(self.error)
    }
  }
}

'use strict'

const debug = require('debug')('dfrl:memory')

class MemoryDB {
  constructor (opts) {
    opts = opts || {}
    this.throttle = opts.throttle
    if (!this.throttle) {
      throw new Error('opts.throttle required')
    }
    this.throttle = this.throttle * 1000

    this.map = new Map()
  }

  setnx (id, timestamp) {
    let lastTimestamp = this.map.get(id)

    return new Promise((resolve) => {
      debug(`timestamp lastTimestamp [${lastTimestamp}], timestamp [${timestamp}], throttle: [${this.throttle}]`)
      if (!lastTimestamp || (timestamp - lastTimestamp) > this.throttle) {
        this.map.set(id, timestamp)
        resolve(1)
      } else {
        resolve(0)
      }
    })
  }

  clear (id) {
    return new Promise((resolve) => {
      debug(`clear [${id}], this.map.has(id): ${this.map.has(id)}`)
      if (this.map.has(id)) {
        this.map.delete(id)
        resolve(1)
      } else {
        resolve(0)
      }
    })
  }
}

module.exports = MemoryDB

'use strict'

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

  setnx (id) {
    let timestamp = Date.now()
    let lastTimestamp = this.map.get(id)

    return new Promise((resolve) => {
      if (!lastTimestamp || (lastTimestamp - timestamp) > this.throttle) {
        this.map.set(id, timestamp)
        resolve(1)
      } else {
        resolve(0)
      }
    })
  }

  clear (id) {
    return new Promise((resolve) => {
      if (this.map.has(id)) {
        resolve(1)
      } else {
        this.map.delete(id)
        resolve(0)
      }
    })
  }
}

module.exports = MemoryDB

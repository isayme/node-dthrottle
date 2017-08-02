'use strict'

const debug = require('debug')('dfrl:memory')

class MemoryDB {
  constructor (opts) {
    opts = opts || {}
    this.expire = opts.expire
    if (!this.expire) {
      throw new Error('opts.expire required')
    }
    this.expire = this.expire * 1000

    this.map = new Map()
  }

  setnx (id, timestamp) {
    return new Promise((resolve) => {
      let lastTimestamp = this.map.get(id)
      debug(`timestamp lastTimestamp [${lastTimestamp}], timestamp [${timestamp}], expire: [${this.expire}]`)
      if (!lastTimestamp || (timestamp - lastTimestamp) > this.expire) {
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

'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('debug')('dfrl:redis')

const luaScript = fs.readFileSync(path.join(__dirname, '../../lua/lock.lua'), {encoding: 'utf8'})

class Redis {
  constructor (opts) {
    opts = opts || {}
    this.redis = opts.redis
    if (!this.redis) {
      throw new Error('opts.redis required')
    }

    this.throttle = opts.throttle
    if (!this.throttle) {
      throw new Error('opts.throttle required')
    }

    this.prefix = opts.prefix
    if (!this.prefix) {
      throw new Error('opts.prefix required')
    }

    debug(`prefix: ${this.prefix}, throttle: ${this.throttle}`)
  }

  setnx (id) {
    let timestamp = Date.now()
    return new Promise((resolve, reject) => {
      this.redis.eval(luaScript, 1, `${this.prefix}:${id}`, timestamp, this.throttle, (err, success) => {
        debug(`lock key [${this.prefix}:${id}], timestamp [${timestamp}], throttle [${this.throttle}], return [${err}, ${success}]`)
        if (err) {
          reject(err)
        } else {
          resolve(success)
        }
      })
    })
  }

  clear (id) {
    return new Promise((resolve, reject) => {
      this.redis.del(`${this.prefix}:${id}`, (err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
    })
  }
}

module.exports = Redis

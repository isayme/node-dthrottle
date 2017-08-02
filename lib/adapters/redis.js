'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('debug')('dthrottle:redis')

const luaScript = fs.readFileSync(path.join(__dirname, '../../lua/lock.lua'), {encoding: 'utf8'})

class Redis {
  constructor (opts) {
    opts = opts || {}
    this.redis = opts.redis
    if (!this.redis) {
      throw new Error('opts.redis required')
    }

    this.expire = opts.expire
    if (!this.expire) {
      throw new Error('opts.expire required')
    }

    this.prefix = opts.prefix
    if (!this.prefix) {
      throw new Error('opts.prefix required')
    }

    debug(`prefix: ${this.prefix}, expire: ${this.expire}`)
  }

  setnx (id, timestamp) {
    return this.redis.eval(luaScript, 1, `${this.prefix}:${id}`, timestamp, this.expire)
  }

  clear (id) {
    return this.redis.del(`${this.prefix}:${id}`)
  }
}

module.exports = Redis

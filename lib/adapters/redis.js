'use strict'

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
  }

  setnx (id) {
    let timestamp = Date.now()
    return new Promise((resolve, reject) => {
      this.redis.setnx(`${this.prefix}:${id}`, timestamp, (err, success) => {
        if (err) {
          return reject(err)
        }

        if (success) {
          this.redis.expire(id, this.throttle, (err) => {
            if (err) {
              return reject(err)
            }
            resolve(1)
          })
        } else {
          resolve(0)
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

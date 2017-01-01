'use strict'

exports.dfrl = require('./dfrl')

exports.Adapters = {
  memory: require('./adapters/memory'),
  redis: require('./adapters/redis')
}

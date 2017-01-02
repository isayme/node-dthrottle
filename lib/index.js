'use strict'

let Adapters = {}
Adapters.memory = Adapters.Memory = require('./adapters/memory')
Adapters.redis = Adapters.Redis = require('./adapters/redis')

module.exports = require('./dfrl')
module.exports.Adapters = Adapters

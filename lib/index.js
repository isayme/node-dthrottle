'use strict'

let Adapters = {}
Adapters.memory = Adapters.Memory = require('./adapters/memory')
Adapters.redis = Adapters.Redis = require('./adapters/redis')

module.exports = require('./dthrottle')
module.exports.Adapters = Adapters

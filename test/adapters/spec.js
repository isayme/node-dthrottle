'use strict'

const expect = require('chai').expect
const redis = require('redis')
const utils = require('../utils')
const Memory = require('../../lib/').Adapters.memory
const Redis = require('../../lib/').Adapters.redis

const adapters = {
  memory: new Memory({
    throttle: 1
  }),
  redis: new Redis({
    throttle: 1,
    redis: redis.createClient(),
    prefix: 'dfrl:spec'
  })
}

const id = 'uniqueId'

for (let adapterName in adapters) {
  let adapter = adapters[adapterName]

  describe(`${adapterName} SPEC`, function () {
    afterEach(function * () {
      yield adapter.clear(id)
    })

    describe('setnx', function () {
      it('should only one call success', function * () {
        let timestamp = Date.now()

        let requests = []
        for (let i = 0; i < 100; i++) {
          requests.push(adapter.setnx(id, timestamp))
        }

        let res = yield requests
        let sum = utils.sum(res)
        expect(sum).equal(1)
      })

      it('should able setnx after throttle', function * () {
        let timestamp = Date.now()

        let res
        res = yield adapter.setnx(id, timestamp)
        expect(res).equal(1)

        yield utils.delay(1000)

        res = yield adapter.setnx(id, Date.now())
        expect(res).equal(1)
      })
    })

    describe('clear', function () {
      it('should able setnx after clear', function * () {
        let timestamp = Date.now()

        let res
        res = yield adapter.setnx(id, timestamp)
        expect(res).equal(1)

        res = yield adapter.clear(id)
        expect(res).equal(1)

        res = yield adapter.setnx(id, timestamp)
        expect(res).equal(1)
      })

      it('should return 1 when clear success', function * () {
        let timestamp = Date.now()

        let res
        res = yield adapter.setnx(id, timestamp)
        expect(res).equal(1)

        res = yield adapter.clear(id)
        expect(res).equal(1)
      })

      it('should return 0 when clear fail', function * () {
        let res
        res = yield adapter.clear(id)
        expect(res).equal(0)
      })
    })
  })
}

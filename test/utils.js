'use strict'

exports.delay = (delayTime) => {
  return new Promise(resolve => {
    setTimeout(resolve, delayTime)
  })
}

exports.sum = (arr) => {
  return arr.reduce((total, cur) => total + cur, 0)
}

exports.promisify = (func) => {
  return function () {
    let args = Array.prototype.slice.call(arguments)
    return new Promise((resolve, reject) => {
      args.push((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })

      func.apply(this, args)
    })
  }
}

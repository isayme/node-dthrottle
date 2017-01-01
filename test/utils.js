'use strict'

exports.delay = (delayTime) => {
  return new Promise(resolve => {
    setTimeout(resolve, delayTime)
  })
}

exports.sum = (arr) => {
  return arr.reduce((total, cur) => total + cur, 0)
}

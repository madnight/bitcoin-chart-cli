const { always, gt, cond, T } = require('lodash/fp')

const print = string => process.stdout.write(string + '\n')
const id = always
const normalize = cond([
    [gt(0.0001), id(8)],
    [gt(0.01),   id(6)],
    [gt(0.1),    id(3)],
    [gt(100),    id(2)],
    [T,          id(0)]
])

module.exports = { print: print, normalize: normalize }

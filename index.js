const _ = require('lodash-fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')
const today = moment().format('YYYY-MM-DD')

const q = moment().subtract(120, 'days').format('YYYY-MM-DD')
console.log(today)
console.log(q)
const url = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${q}&end=${today}`

axios.get(url)
  .then(function (response) {
    const x = _.get('data.bpi')(response)
    const y = _.values(x)
    console.log(y.length)
    console.log (asciichart.plot (y,{ height: 14 }))
  })
  .catch(function (error) {
    console.log(error)
  })


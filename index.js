const _ = require('lodash-fp')
const l = require('lodash')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')

const today = moment().format('YYYY-MM-DD')
const days = 2000
const maxWidth = 100
const q = moment().subtract(days, 'days').format('YYYY-MM-DD')
const coindesk = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${q}&end=${today}`

const bitcoin = async url => {
    const res = await axios.get(url)
    const data = _.flow(
        _.get('data.bpi'),
        _.values,
        _.chunk(_.ceil(days/maxWidth)),
        _.map(l.mean)
    )(res)
    console.log (asciichart.plot (data, { height: 14 }))
    console.log(`\t\t Bitcoin Chart from ${q} to ${today}`)
}

bitcoin(coindesk)


const _ = require('lodash-fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')

const today = moment().format('YYYY-MM-DD')
const q = moment().subtract(90, 'days').format('YYYY-MM-DD')
const coindesk = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${q}&end=${today}`

const bitcoin = async url => {
    const res = await axios.get(url)
    const data = _.flow(
        _.get('data.bpi'),
        _.values
    )(res)
    console.log (asciichart.plot (data, { height: 14 }))
    console.log(`\t\t Bitcoin Chart from ${q} to ${today}`)
}

bitcoin(coindesk)


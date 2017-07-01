const _ = require('lodash-fp')
const l = require('lodash')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')

// Options
const days = 30      // number of days the chart will go back
const maxWidth = 100 // max terminal chart width
const maxHeight = 20 // max terminal chart height

const today = moment().format('YYYY-MM-DD')
const past = moment().subtract(days, 'days').format('YYYY-MM-DD')
const coindesk = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${past}&end=${today}`

const bitcoin = async url => {
    const res = await axios.get(url)
    const data = _.flow(
        _.get('data.bpi'),
        _.values,
        _.chunk(_.ceil(days/maxWidth)),
        _.map(l.mean)
    )(res)
    console.log(asciichart.plot (data, { height: maxHeight }))
    console.log(`\t\t Bitcoin Chart from ${past} to ${today}`)
}

bitcoin(coindesk)


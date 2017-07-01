const _ = require('lodash/fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')

// command line parsing
// https://github.com/tj/commander.js/

// Options
const days = 300      // number of days the chart will go back
const maxWidth = 100 // max terminal chart width
const maxHeight = 20 // max terminal chart height

const today = moment().format('YYYY-MM-DD')
const past = moment().subtract(days, 'days').format('YYYY-MM-DD')
const coindesk = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${past}&end=${today}`
const coindeskCurrent = 'http://api.coindesk.com/v1/bpi/currentprice.json'

const current = async url => {
    const res = await axios.get(url)
    return _.flow(
        _.get('data.bpi'),
        _.at(['USD.rate_float', 'EUR.rate_float']),
        _.map(x => Number(x).toFixed(2))
    )(res)
}

const bitcoin = async url => {
    const res = await axios.get(url)
    return _.flow(
        _.get('data.bpi'),
        _.values,
        _.chunk(_.ceil(days/maxWidth)),
        _.map(_.mean)
    )(res)
}

const main = async () => {
    const history = await bitcoin(coindesk)
    const [dollar, euro] = await current(coindeskCurrent)
    console.log(asciichart.plot (history, { height: maxHeight }))
    console.log(`\t\t Bitcoin chart from ${past} to ${today}`)
    console.log(`\t\t Bitcoin current price ${dollar} US-Dollar / ${euro} Euro`)
}

main()

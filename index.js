#!/usr/bin/env node

const _ = require('lodash/fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')
const param = require('commander')

// command line parsing
param
    .version('1.0.0')
    .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
    .option('-w, --width <n>', 'max terminal chart width', parseInt)
    .option('-h, --height <n>', 'max terminal chart height', parseInt)
    .parse(process.argv)

const days = _.defaultTo(300)(param.days)
const maxWidth = _.defaultTo(100)(param.width)
const maxHeight = _.defaultTo(14)(param.height)

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

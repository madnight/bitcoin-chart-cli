#!/usr/bin/env node

const {get, defaultTo, map, flow, at,
    values, chunk, ceil, mean} = require('lodash/fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')
const param = require('commander')
const wrap = require('word-wrap')

param
    .version('1.0.2')
    .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
    .option('-w, --width <n>', 'max terminal chart width', parseInt)
    .option('-h, --height <n>', 'max terminal chart height', parseInt)
    .option('--disable-legend', 'disable legend text')
    .parse(process.argv)

const days = defaultTo(90)(param.days)
const maxWidth = defaultTo(100)(param.width)
const maxHeight = defaultTo(14)(param.height)

const today = moment().format('YYYY-MM-DD')
const past = moment().subtract(days, 'days').format('YYYY-MM-DD')
const coindesk = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${past}&end=${today}`
const coindeskCurrent = 'http://api.coindesk.com/v1/bpi/currentprice.json'

const current = async url => {
    const res = await axios.get(url)
    return flow(
        get('data.bpi'),
        at(['USD.rate_float', 'EUR.rate_float']),
        map(x => Number(x).toFixed(2))
    )(res)
}

const bitcoin = async url => {
    const res = await axios.get(url)
    return flow(
        get('data.bpi'),
        values,
        chunk(ceil(days/maxWidth)),
        map(mean)
    )(res)
}

const main = async () => {
    const fetchApi = [bitcoin(coindesk), current(coindeskCurrent)]
    const [history, [dollar, euro]] = await Promise.all(fetchApi)
    console.log(asciichart.plot (history, { height: maxHeight }))
    if (!param.disableLegend) {
        const legend = `\t\tBitcoin chart past ${days} days ${past} to ${today}. Current ${dollar}$ / ${euro}€.`
        console.log(wrap(legend, {width: maxWidth, newline: '\n\t\t'}))
    }
}

main()

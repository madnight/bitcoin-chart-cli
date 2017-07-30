#!/usr/bin/env node

const {get, defaultTo, map, lowerFirst,
    flow, remove, chunk, ceil, last, isEmpty,
    mean, negate, first} = require('lodash/fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')
const param = require('commander')
const wrap = require('word-wrap')
const {coins} = require('./coins')

param
    .version('2.0.0')
    .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
    .option('--hours <n>', 'number of hours the chart will go back', parseInt)
    .option('--mins <n>', 'number of minutes the chart will go back', parseInt)
    .option('-w, --width <n>', 'max terminal chart width', parseInt)
    .option('-h, --height <n>', 'max terminal chart height', parseInt)
    .option('--disable-legend', 'disable legend text')

const addCoin = coin => param.option(`--${coin}`, `show ${coin} chart`)

// add coins from coins.js
flow(map(flow(last, lowerFirst, addCoin)))(coins)
param.parse(process.argv)

const days = defaultTo(90)(param.days)
const maxWidth = defaultTo(100)(param.width)
const maxHeight = defaultTo(14)(param.height)

const time = [
    [param.mins, 'minutes', 'histominute'],
    [param.hours, 'hours', 'histohour'],
    [days, 'days', 'histoday']
]

const paramSet = p => param[p]
const [timePast, timeName, timeApi] = flow(remove(negate(first)), first)(time)
const defaultToBitcoin = x => isEmpty(x) ? ['BTC', 'Bitcoin'] : first(x)
const [coin, coinname] = flow(remove(negate(flow(last, lowerFirst, paramSet))), defaultToBitcoin)(coins)
const timeFormat = 'YYYY-MM-DD hh:mm a'
const past = moment().subtract(timePast, timeName).format(timeFormat)
const ccApi = `https://min-api.cryptocompare.com/data/${timeApi}?fsym=${coin}&tsym=USD&limit=${timePast}&e=CCCAGG`
const ccApiCurrent = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD,EUR`
const current = async url => (await axios.get(url)).data
const print = string => process.stdout.write(string + '\n')

const bitcoin = async url => {
    const res = await axios.get(url)
    return flow(
        get('data.Data'),
        map('close'),
        chunk(ceil(days/maxWidth)),
        map(mean)
    )(res)
}

const main = async () => {
    const fetchApi = [bitcoin(ccApi), current(ccApiCurrent)]
    const [history, {USD, EUR}] = await Promise.all(fetchApi)
    const legend = `\t${coinname} chart past ${timePast} ${timeName} since ${past}. Current ${USD}$ / ${EUR}€.`
    print(asciichart.plot (history, { height: maxHeight }))
    return !param.disableLegend && print(wrap(legend, {width: maxWidth, newline: '\n\t\t'}))
}

main()

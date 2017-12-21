#!/usr/bin/env node

const { get, defaultTo, map, flow, sortBy, remove, always,
    toLower, trim, negate, first, pad, max, gt, cond, T }
                            = require('lodash/fp')
const axios                 = require('axios')
const moment                = require('moment')
const asciichart            = require ('asciichart')
const param                 = require('commander')
const { version }           = require('./package.json')
const { interpolateArray }  = require('array-interpolatejs')

const print = string => process.stdout.write(string + '\n')
const id = always

param
    .version(version)
    .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
    .option('--hours <n>', 'number of hours the chart will go back', parseInt)
    .option('--mins <n>', 'number of minutes the chart will go back', parseInt)
    .option('-w, --width <n>', 'max terminal chart width', parseInt)
    .option('-h, --height <n>', 'max terminal chart height', parseInt)
    .option('-c, --coin <string>', 'specify the coin e.g. ETH (Default: BTC)', 'BTC')
    .option('--currency <string>', 'specify the trading pair currency (Default: USD)', 'USD')
    .option('-l, --list', 'list all available coins')
    .option('--disable-legend', 'disable legend text')
    .parse(process.argv)

// Parameter defaults
const days = defaultTo(90)(param.days)
const maxWidth = defaultTo(100)(param.width)
const maxHeight = defaultTo(14)(param.height)

// Time interval
const time = [
    [param.mins  ,'minutes' ,'histominute'],
    [param.hours ,'hours'   ,'histohour'],
    [days        ,'days'    ,'histoday']
]
const [timePast, timeName, timeApi] = flow(remove(negate(first)), first)(time)
const timeFormat = 'YYYY-MM-DD hh:mm a'
const past = moment().subtract(timePast, timeName).format(timeFormat)

// API Urls
const baseApiURL = 'https://min-api.cryptocompare.com/data/'
const ccApiHist = `${baseApiURL}${timeApi}?fsym=${param.coin}`
    + `&tsym=${param.currency}&limit=${timePast}&e=CCCAGG`
const ccApiCurrent = `${baseApiURL}price?fsym=${param.coin}&tsyms=${param.currency}`
const ccApiAll = 'https://www.cryptocompare.com/api/data/coinlist'

// API call functions
const fetchCoinList = async url =>
    flow(
        get('data.Data'),
        map('FullName')
    )(await axios.get(url))

const fetchCoinCurrentPrice = async url => (await axios.get(url)).data

const fetchCoinHistory = async url =>
    flow(
        get('data.Data'),
        map('close'),
        interpolateArray(maxWidth)
    )(await axios.get(url))

const fetchApis = [
    fetchCoinHistory(ccApiHist),
    fetchCoinCurrentPrice(ccApiCurrent)
]

const normalize = cond([
    [gt(0.0001), id(8)],
    [gt(0.01),   id(6)],
    [gt(0.1),    id(3)],
    [gt(100),    id(2)],
    [T,          id(0)]
])

const main = async () => {

    const [history, value] = await Promise.all(fetchApis)
    const legend = `\t ${param.coin} last ${timePast}`
        + ` ${timeName} since ${past}.`
        + ` Now: ${value[param.currency]} ${param.currency}`

    const smallLegend = `\t ${param.coin} last ${timePast}`
        + ` ${timeName}. Now: ${value[param.currency]} ${param.currency}`

    const fixed = normalize(max(history))
    const fixedHist = map(x => x.toFixed(fixed))(history)
    const padding = pad(2 + max(fixedHist).toString().length)('')

    print(asciichart.plot(fixedHist, {
        height: maxHeight,
        padding: padding,
        format: x => (padding + x.toFixed(fixed)).slice(-padding.length)
    }))

    return maxWidth < 40 ? false :
        !param.disableLegend && print(maxWidth < 65 ? smallLegend : legend)
}

const printCoins = async () => {
    return flow(
        map(trim),
        sortBy(toLower),
        map(print)
    )(await fetchCoinList(ccApiAll))
}

param.list && printCoins() || main()

// Coin not found
process.on('unhandledRejection', () =>
    print(`Sorry. The coin/currency pair ${param.coin}/${param.currency} `
        + 'does not exist in the cryptocompare api.'))

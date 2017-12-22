#!/usr/bin/env node

const {defaultTo, map, flow, sortBy,
    remove, toLower, trim, negate, first, pad, max }
                            = require('lodash/fp')
const moment                = require('moment')
const asciichart            = require ('asciichart')
const param                 = require('commander')
const { version }           = require('./package.json')
const { interpolateArray }  = require('array-interpolatejs')
const { CryptoCompareAPI }  = require('./src/CryptoCompareAPI.js')
const { print, normalize }  = require('./src/utils.js')

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

const main = async () => {

    const history = interpolateArray(maxWidth)(await CryptoCompareAPI.
        fetchCoinHistory(timeApi, param.coin, param.currency, timePast))

    const value = await CryptoCompareAPI.
        fetchCoinPrice(param.coin, param.currency)

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
    )(await CryptoCompareAPI.fetchCoinList())
}

param.list && printCoins() || main()

// Coin not found
process.on('unhandledRejection', () =>
    print(`Sorry. The coin/currency pair ${param.coin}/${param.currency} `
        + 'does not exist in the cryptocompare api.'))

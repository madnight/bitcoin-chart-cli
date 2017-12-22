#!/usr/bin/env node

const {map, flow, sortBy, remove, toLower,
    trim, negate, first, pad, max }
                             = require('lodash/fp')
const { days, mins, hours, maxWidth, maxHeight, coin, currency,
    showCoinList, disableLegend }
                             = require('./src/arguments.js')
const moment                 = require('moment')
const asciichart             = require ('asciichart')
const { interpolateArray }   = require('array-interpolatejs')
const { CryptoCompareAPI }   = require('./src/CryptoCompareAPI.js')
const { print, normalize }   = require('./src/utils.js')

const time = [
    [mins  ,'minutes' ,'histominute'],
    [hours ,'hours'   ,'histohour'],
    [days  ,'days'    ,'histoday']
]
const [timePast, timeName, timeApi] = flow(remove(negate(first)), first)(time)
const timeFormat = 'YYYY-MM-DD hh:mm a'
const past = moment().subtract(timePast, timeName).format(timeFormat)

const main = async () => {
    const history = interpolateArray(maxWidth)(await CryptoCompareAPI.
        fetchCoinHistory(timeApi, coin, currency, timePast))

    const value = await CryptoCompareAPI.fetchCoinPrice(coin, currency)

    const legend = `\t ${coin} last ${timePast}`
        + ` ${timeName} since ${past}.`
        + ` Now: ${value[currency]} ${currency}`

    const smallLegend = `\t ${coin} last ${timePast}`
        + ` ${timeName}. Now: ${value[currency]} ${currency}`

    const fixed = normalize(max(history))
    const fixedHist = map(x => x.toFixed(fixed))(history)
    const padding = pad(2 + max(fixedHist).toString().length)('')

    print(asciichart.plot(fixedHist, {
        height: maxHeight,
        padding: padding,
        format: x => (padding + x.toFixed(fixed)).slice(-padding.length)
    }))

    return maxWidth < 40 ? false :
        !disableLegend && print(maxWidth < 65 ? smallLegend : legend)
}

const printCoins = async () => {
    return flow(
        map(trim),
        sortBy(toLower),
        map(print)
    )(await CryptoCompareAPI.fetchCoinList())
}

showCoinList && printCoins() || main()

// Coin not found
process.on('unhandledRejection', () =>
    print(`Sorry. The coin/currency pair ${coin}/${currency} `
        + 'does not exist in the cryptocompare api.'))

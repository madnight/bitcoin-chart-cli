#!/usr/bin/env node

const { map, flow, sortBy, remove, toLower,
    trim, negate, first, pad, max } = require('lodash/fp')
const { days, mins, hours, maxWidth, maxHeight, coin, currency, live,
    showCoinList, disableLegend }   = require('./src/arguments.js')
const moment                        = require('moment')
const asciichart                    = require ('asciichart')
const { interpolateArray }          = require('array-interpolatejs')
const { CryptoCompareAPI }          = require('./src/CryptoCompareAPI.js')
const { print, normalize }          = require('./src/utils.js')
const { livePrice }                 = require('./src/live.js')

const time = () =>
    flow(remove(negate(first)), first)([
        [mins  ,'minutes' ,'histominute'],
        [hours ,'hours'   ,'histohour'],
        [days  ,'days'    ,'histoday']
    ])

const printCoins = async () =>
    flow(map(trim), sortBy(toLower), map(print))(
        await CryptoCompareAPI.fetchCoinList())

const main = async () => {

    const [timePast, timeName, timeApi] = time()
    const past = moment()
        .subtract(timePast, timeName)
        .format('YYYY-MM-DD hh:mm a')

    const history = interpolateArray(maxWidth)(await CryptoCompareAPI.
        fetchCoinHistory(timeApi, coin, currency, timePast))
    const value = await CryptoCompareAPI.fetchCoinPrice(coin, currency)

    const baseLegend = `\t ${coin} last ${timePast} ${timeName}`
    const now = `. Now: ${value[currency]} ${currency}`
    const legend = baseLegend + ` since ${past}` + now
    const smallLegend = baseLegend + now

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

showCoinList && printCoins() || live ? livePrice(maxWidth, maxHeight) : main()

// Coin not found
process.on('unhandledRejection', () =>
    print(`Sorry. The coin/currency pair ${coin}/${currency} `
        + 'does not exist in the cryptocompare api.'))

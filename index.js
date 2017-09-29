#!/usr/bin/env node

const {get, defaultTo, map, flow, sortBy,
    remove, chunk, ceil, mean, toLower, trim,
    negate, first} = require('lodash/fp')
const axios = require('axios')
const moment = require('moment')
const asciichart = require ('asciichart')
const param = require('commander')
const wrap = require('word-wrap')
const print = string => process.stdout.write(string + '\n')

param
    .version('3.0.0')
    .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
    .option('--hours <n>', 'number of hours the chart will go back', parseInt)
    .option('--mins <n>', 'number of minutes the chart will go back', parseInt)
    .option('-w, --width <n>', 'max terminal chart width', parseInt)
    .option('-h, --height <n>', 'max terminal chart height', parseInt)
    .option('-c, --coin <string>', 'specify the coin e.g. ETH', 'BTC')
    .option('-m, --market <string>', 'specify the market e.g. USD, EUR, BTC', 'USD')
    .option('-l, --list', 'list all available coins')
    .option('--disable-legend', 'disable legend text')
    .parse(process.argv)

// Parameter defaults
const days = defaultTo(90)(param.days)
const maxWidth = defaultTo(process.stdout.columns)(param.width)
const maxHeight = defaultTo(process.stdout.rows - 4)(param.height) // minus some padding to fit the next terminal input lines

// Time interval
const time = [
    [param.mins, 'minutes', 'histominute'],
    [param.hours, 'hours', 'histohour'],
    [days, 'days', 'histoday']
]
const [timePast, timeName, timeApi] = flow(remove(negate(first)), first)(time)
const timeFormat = 'YYYY-MM-DD hh:mm a'
const past = moment().subtract(timePast, timeName).format(timeFormat)

// API Urls
const baseApiURL = 'https://min-api.cryptocompare.com/data/'
const ccApiHist = `${baseApiURL}${timeApi}?fsym=${param.coin}`
    + `&tsym=${param.market}&limit=${timePast}&e=CCCAGG`
const ccApiCurrent = `${baseApiURL}price?fsym=${param.coin}&tsyms=${param.market}`
const ccApiAll = 'https://www.cryptocompare.com/api/data/coinlist'

// API call functions
const fetchCoinList = async url =>
    flow(
        get('data.Data'),
        map('FullName')
    )(await axios.get(url))

const fetchCoinInfo = async url =>
    get(`data.Data.${param.coin}`)(await axios.get(url))

const fetchCoinCurrentPrice = async url => (await axios.get(url)).data

const fetchCoinHistory = async url =>
    flow(
        get('data.Data'),
        map('close'),
        chunk(ceil(days/maxWidth)),
        map(mean)
    )(await axios.get(url))

const main = async () => {
    if (param.list) // eslint-disable-line
        return map(flow(trim, print))(
            sortBy(flow(trim, toLower))(
                await fetchCoinList(ccApiAll)))

    const fetchApis = [
        fetchCoinInfo(ccApiAll),
        fetchCoinHistory(ccApiHist),
        fetchCoinCurrentPrice(ccApiCurrent)
    ]
    const [{CoinName}, history, value] = await Promise.all(fetchApis)
    const market = param
    const legend = `\t${CoinName} chart past ${timePast}`
        + ` ${timeName} since ${past}. Current value: ${value[param.market]} ${param.market}`

    print(asciichart.plot (history, { height: maxHeight }))
    return !param.disableLegend
        && print(wrap(legend, {width: maxWidth, newline: '\n\t\t'}))
}

main()

// Coin not found
process.on('unhandledRejection', () =>
    print(`Sorry. The coin/market pair ${param.coin}/${param.market} `
        + 'does not exist in the cryptocompare api.'))

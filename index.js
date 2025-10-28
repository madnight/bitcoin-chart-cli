#!/usr/bin/env node

import args from "./src/arguments.js"
import asciichart from "asciichart"
import { CryptoCompareAPI } from "./src/CryptoCompareAPI.js"
import { print, normalize, time, interpolate } from "./src/utils.js"
import { printTopList } from "./src/toplist.js"
import {
  printTechIndicatorChart,
  getTechIndicator,
  getTechIndicatorColors,
} from "./src/technical-indicator.js"

const printCoins = async () => {
  const coins = await CryptoCompareAPI.fetchCoinList()
  coins
    .map(coin => coin.trim())
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .forEach(coin => print(coin))
}

const getMinRange = (max, min) => {
  if (max - min > args.minRange) return []
  const dist = max - min
  const range = args.minRange / 2 - dist / 2
  return [max + range, min - range]
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12
  hours = String(hours).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`
}

const main = async () => {
  const [timePast, timeName, timeApi] = time()
  const pastDate = new Date()
  if (timeName === 'minutes') {
    pastDate.setMinutes(pastDate.getMinutes() - timePast)
  } else if (timeName === 'hours') {
    pastDate.setHours(pastDate.getHours() - timePast)
  } else if (timeName === 'days') {
    pastDate.setDate(pastDate.getDate() - timePast)
  }
  const past = formatDate(pastDate)

  const fullHistroy = await CryptoCompareAPI.fetchCoinHistory(
    timeApi,
    args.coin,
    args.currency,
    timePast
  )

  const history = interpolate(fullHistroy)
  const value = await CryptoCompareAPI.fetchCoinPrice(args.coin, args.currency)

  const baseLegend = `\t ${args.coin} last ${timePast} ${timeName}`
  const now = `. Now: ${value[args.currency]} ${args.currency}`
  const legend = baseLegend + ` since ${past}` + now
  const smallLegend = baseLegend + now

  const fixed = normalize(Math.max(...history))
  const fixedHist = history.map((x) => Number(x.toFixed(fixed)))
  const padding = " ".repeat(2 + Math.max(...fixedHist).toString().length)
  const [maxH, minH] = getMinRange(Math.max(...fixedHist), Math.min(...fixedHist))
  const chart = getTechIndicator(fullHistroy).concat([fixedHist])
  try {
    print(
      asciichart.plot(chart, {
        height: args.maxHeight,
        max: args.minRange ? maxH : args.max,
        min: args.minRange ? minH : args.min,
        padding: padding,
        colors: getTechIndicatorColors(),
        format: (x) => (padding + x.toFixed(fixed)).slice(-padding.length),
      })
    )
  } catch (e) {
    console.log(
      "Couldn't plot chart. Please try different width or height settings."
    )
    process.exit(1)
  }

  if (args.maxWidth > 40 && !args.disableLegend) {
    print(args.maxWidth < 65 ? smallLegend : legend)
  }

  printTechIndicatorChart(fullHistroy, padding)
}

if (args.showCoinList) {
  printCoins()
} else if (args.topList) {
  printTopList()
} else {
  main()
}

import TI from "technicalindicators"
import args from "./arguments.js"
import lodash from "lodash/fp.js"
import asciichart from "asciichart"
import { print, time, interpolate } from "./utils.js"

const { map } = lodash

export const getTechIndicator = (values) => {
  if (!args.technicalIndicator) return []

  let indicator = []

  if (args.technicalIndicator.includes("BB")) {
    const bb = TI.BollingerBands.calculate({
      period: 14,
      values: values,
      stdDev: 2,
    })
    const lower = map("lower", bb)
    const upper = map("upper", bb)
    indicator = indicator.concat([lower, upper].map(interpolate))
  }

  if (args.technicalIndicator.includes("SMA")) {
    const sma = TI.SMA.calculate({
      period: 20,
      values: values,
    })
    indicator = indicator.concat([sma].map(interpolate))
  }

  if (args.technicalIndicator.includes("EMA")) {
    const ema = TI.EMA.calculate({
      period: 10,
      values: values,
    })
    indicator = indicator.concat([ema].map(interpolate))
  }

  return indicator
}

export const getTechIndicatorColors = () => {
  if (!args.technicalIndicator) return []

  let indicatorColors = [asciichart.default]

  if (args.technicalIndicator.includes("EMA")) {
    indicatorColors = [asciichart.magenta].concat(indicatorColors)
  }

  if (args.technicalIndicator.includes("SMA")) {
    indicatorColors = [asciichart.blue].concat(indicatorColors)
  }

  if (args.technicalIndicator.includes("BB")) {
    indicatorColors = [asciichart.green, asciichart.red].concat(indicatorColors)
  }

  return indicatorColors
}

const printLegend = (name, value) => {
  const [timePast, timeName, _] = time()
  print(`\t ${name} ${args.coin} last ${timePast} ${timeName}. Now: ${value}`)
}

const printRSIChart = (values, padding) => {
  const [timePast, timeName, _] = time()
  const rsiPeriod = 14
  const rsi = TI.RSI.calculate({
    period: rsiPeriod,
    values: values,
  })
  const r = interpolate(rsi)
  print(
    "\n" +
      asciichart.plot([r.map((_) => 30), r.map((_) => 70), r], {
        height: args.maxHeight / 2,
        max: 70,
        min: 30,
        padding: padding,
        colors: [asciichart.blue, asciichart.blue, asciichart.red],
      })
  )
  printLegend("RSI", r.slice(-1)[0])
}

const printMACDChart = (values, padding) => {
  const [timePast, timeName, _] = time()
  const rsiPeriod = 14
  const m = TI.MACD.calculate({
    values: values,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  })
  const vals = [map("MACD", m), map("signal", m)].map(interpolate)
  print(
    "\n" +
      asciichart.plot(vals, {
        height: args.maxHeight / 2,
        padding: padding,
        colors: [asciichart.blue, asciichart.red],
      })
  )
  printLegend("MACD", vals.slice(-1)[0][0])
}

export const printTechIndicatorChart = (values, padding) => {
  if (!args.technicalIndicator) return []
  const [timePast, timeName, _] = time()
  if (args.technicalIndicator.includes("RSI")) {
    printRSIChart(values, padding)
  }

  if (args.technicalIndicator.includes("MACD")) {
    printMACDChart(values, padding)
  }
}

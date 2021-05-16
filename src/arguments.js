import { Command } from "commander"
import _ from "lodash/fp.js"
import * as fs from "fs"

const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"))

const program = new Command()
program
  .version(version)
  .option("-d, --days <n>", "number of days the chart will go back", parseInt)
  .option("--hours <n>", "number of hours the chart will go back", parseInt)
  .option("--mins <n>", "number of minutes the chart will go back", parseInt)
  .option("-w, --width <n>", "max terminal chart width", parseInt)
  .option("-h, --height <n>", "max terminal chart height", parseInt)
  .option("--max <n>", "max y-axis value", parseInt)
  .option("--min <n>", "min y-axis value", parseInt)
  .option(
    "--min-range <n>",
    "min range between min and max y-axis value",
    parseInt
  )
  .option("-c, --coin <string>", "specify the coin e.g. ETH", "BTC")
  .option("--currency <string>", "specify the trading pair currency", "USD")
  .option("-l, --list", "list all available coins")
  .option("-t, --toplist <n>", "list of top n coins")
  .option("--disable-legend", "disable legend text")
  .option(
    "-ti, --technical-indicator <type...>",
    "add a technical indicator: RSI SMA BB EMA MACD"
  )
  .parse(process.argv)

const param = program.opts()

export default {
  days: _.defaultTo(90)(param.days),
  mins: param.mins,
  hours: param.hours,
  coin: param.coin,
  max: param.max,
  min: param.min,
  technicalIndicator: param.technicalIndicator,
  minRange: param.minRange,
  currency: param.currency,
  maxWidth: _.defaultTo(100)(param.width),
  maxHeight: _.defaultTo(14)(param.height),
  showCoinList: param.list,
  topList: param.toplist,
  disableLegend: param.disableLegend,
}

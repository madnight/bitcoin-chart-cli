const param = require("commander");
const { version } = require("../package.json");
const { defaultTo } = require("lodash/fp");

param
    .version(version)
    .option("-d, --days <n>", "number of days the chart will go back", parseInt)
    .option("--hours <n>", "number of hours the chart will go back", parseInt)
    .option("--mins <n>", "number of minutes the chart will go back", parseInt)
    .option("-w, --width <n>", "max terminal chart width", parseInt)
    .option("-h, --height <n>", "max terminal chart height", parseInt)
    .option("--max <n>", "max y-axis value", parseInt)
    .option("--min <n>", "min y-axis value", parseInt)
    .option("--min-range <n>", "min range between min and max y-axis value", parseInt)
    .option(
        "-c, --coin <string>",
        "specify the coin e.g. ETH (Default: BTC)",
        "BTC"
    )
    .option(
        "--currency <string>",
        "specify the trading pair currency (Default: USD)",
        "USD"
    )
    .option("-l, --list", "list all available coins")
    .option("-t, --toplist <n>", "list of top n coins")
    .option("--disable-legend", "disable legend text")
    .parse(process.argv);

module.exports = {
    days: defaultTo(90)(param.days),
    mins: param.mins,
    hours: param.hours,
    coin: param.coin,
    max: param.max,
    min: param.min,
    minRange: param.minRange,
    currency: param.currency,
    maxWidth: defaultTo(100)(param.width),
    maxHeight: defaultTo(14)(param.height),
    showCoinList: param.list,
    topList: param.toplist,
    disableLegend: param.disableLegend,
};

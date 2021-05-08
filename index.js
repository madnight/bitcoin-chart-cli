#!/usr/bin/env node

const args = require("./src/arguments.js");
const asciichart = require("asciichart");
const moment = require("moment");
const { map, flow, sortBy, toLower } = require("lodash/fp");
const { trim, pad, max, min } = require("lodash/fp");
const { currency, showCoinList, topList } = require("./src/arguments.js");
const { CryptoCompareAPI } = require("./src/CryptoCompareAPI.js");
const { print, normalize, time, interpolate } = require("./src/utils.js");
const { printTopList } = require("./src/toplist.js");
const {
    printTechIndicatorChart,
    getTechIndicator,
    getTechIndicatorColors,
} = require("./src/technical-indicator.js");

const printCoins = async () =>
    flow(
        map(trim),
        sortBy(toLower),
        map(print)
    )(await CryptoCompareAPI.fetchCoinList());

const getMinRange = (max, min) => {
    if (max - min > args.minRange) return [];
    const dist = max - min;
    const range = args.minRange / 2 - dist / 2;
    return [max + range, min - range];
};

const main = async () => {
    const [timePast, timeName, timeApi] = time();
    const past = moment()
        .subtract(timePast, timeName)
        .format("YYYY-MM-DD hh:mm a");

    const fullHistroy = await CryptoCompareAPI.fetchCoinHistory(
        timeApi,
        args.coin,
        currency,
        timePast
    );

    const history = interpolate(fullHistroy);
    const value = await CryptoCompareAPI.fetchCoinPrice(args.coin, currency);

    const baseLegend = `\t ${args.coin} last ${timePast} ${timeName}`;
    const now = `. Now: ${value[currency]} ${currency}`;
    const legend = baseLegend + ` since ${past}` + now;
    const smallLegend = baseLegend + now;

    const fixed = normalize(max(history));
    const fixedHist = map((x) => x.toFixed(fixed))(history).map(Number);
    const padding = pad(2 + max(fixedHist).toString().length)("");
    const [maxH, minH] = getMinRange(max(fixedHist), min(fixedHist));
    const chart = getTechIndicator(fullHistroy).concat([fixedHist]);
    try {
        print(
            asciichart.plot(chart, {
                height: args.maxHeight,
                max: args.minRange ? maxH : args.max,
                min: args.minRange ? minH : args.min,
                padding: padding,
                colors: getTechIndicatorColors(),
                format: (x) =>
                    (padding + x.toFixed(fixed)).slice(-padding.length),
            })
        );
    } catch (e) {
        console.log(
            "Couldn't plot chart. Please try different width or height settings."
        );
        process.exit(1);
    }

    if (args.maxWidth > 40 && !args.disableLegend) {
        print(args.maxWidth < 65 ? smallLegend : legend);
    }

    printTechIndicatorChart(fullHistroy, padding);
};

if (showCoinList) {
    printCoins();
} else if (topList) {
    printTopList();
} else {
    main();
}

#!/usr/bin/env node

const args = require("./src/arguments.js");
const asciichart = require("asciichart");
const moment = require("moment");
const { map, flow, sortBy, remove, toLower } = require("lodash/fp");
const { trim, negate, first, pad, max, min } = require("lodash/fp");
const { currency, showCoinList } = require("./src/arguments.js");
const { interpolateArray } = require("array-interpolatejs");
const { CryptoCompareAPI } = require("./src/CryptoCompareAPI.js");
const { print, normalize } = require("./src/utils.js");

const time = () =>
    flow(
        remove(negate(first)),
        first
    )([
        [args.mins, "minutes", "histominute"],
        [args.hours, "hours", "histohour"],
        [args.days, "days", "histoday"],
    ]);

const printCoins = async () =>
    flow(
        map(trim),
        sortBy(toLower),
        map(print)
    )(await CryptoCompareAPI.fetchCoinList());

const getMinRange = (max, min) => {
    if (max - min > args.minRange) return [];
    const dist = max - min;
    return [
        max + (args.minRange / 2 - dist / 2),
        min - (args.minRange / 2 - dist / 2),
    ];
};

const main = async () => {
    const [timePast, timeName, timeApi] = time();
    const past = moment()
        .subtract(timePast, timeName)
        .format("YYYY-MM-DD hh:mm a");

    const history = interpolateArray(args.maxWidth)(
        await CryptoCompareAPI.fetchCoinHistory(
            timeApi,
            args.coin,
            currency,
            timePast
        )
    );
    const value = await CryptoCompareAPI.fetchCoinPrice(args.coin, currency);

    const baseLegend = `\t ${args.coin} last ${timePast} ${timeName}`;
    const now = `. Now: ${value[currency]} ${currency}`;
    const legend = baseLegend + ` since ${past}` + now;
    const smallLegend = baseLegend + now;

    const fixed = normalize(max(history));
    const fixedHist = map((x) => x.toFixed(fixed))(history).map(Number);
    const padding = pad(2 + max(fixedHist).toString().length)("");
    const [maxH, minH] = getMinRange(max(fixedHist), min(fixedHist));

    try {
        print(
            asciichart.plot(fixedHist, {
                height: args.maxHeight,
                max: args.minRange ? maxH : args.max,
                min: args.minRange ? minH : args.min,
                padding: padding,
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

    return args.maxWidth < 40
        ? false
        : !args.disableLegend &&
              print(args.maxWidth < 65 ? smallLegend : legend);
};

(showCoinList && printCoins()) || main();

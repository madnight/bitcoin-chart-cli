const TI = require("technicalindicators");
const args = require("./arguments.js");
const { map } = require("lodash/fp");
const asciichart = require("asciichart");
const { print, time, interpolate } = require("./utils.js");

const getTechIndicator = (values) => {
    if (!args.technicalIndicator) return [];

    let indicator = [];

    if (args.technicalIndicator.includes("BB")) {
        const bb = TI.BollingerBands.calculate({
            period: 14,
            values: values,
            stdDev: 2,
        });
        const lower = map("lower", bb);
        const upper = map("upper", bb);
        indicator = indicator.concat([lower, upper].map(interpolate));
    }

    if (args.technicalIndicator.includes("SMA")) {
        const sma = TI.SMA.calculate({
            period: 20,
            values: values,
        });
        indicator = indicator.concat([sma].map(interpolate));
    }

    if (args.technicalIndicator.includes("EMA")) {
        const ema = TI.EMA.calculate({
            period: 10,
            values: values,
        });
        indicator = indicator.concat([ema].map(interpolate));
    }

    return indicator;
};

const getTechIndicatorColors = () => {
    if (!args.technicalIndicator) return [];

    let indicatorColors = [asciichart.default];

    if (args.technicalIndicator.includes("EMA")) {
        indicatorColors = [asciichart.magenta].concat(indicatorColors);
    }

    if (args.technicalIndicator.includes("SMA")) {
        indicatorColors = [asciichart.blue].concat(indicatorColors);
    }

    if (args.technicalIndicator.includes("BB")) {
        indicatorColors = [asciichart.green, asciichart.red].concat(
            indicatorColors
        );
    }

    return indicatorColors;
};

const printTechIndicatorChart = (values, padding) => {
    if (!args.technicalIndicator) return [];
    const [timePast, timeName, _] = time();
    if (args.technicalIndicator.includes("RSI")) {
        const rsiPeriod = 14;
        const rsi = TI.RSI.calculate({
            period: rsiPeriod,
            values: values,
        });
        const r = interpolate(rsi);
        print(
            "\n" +
                asciichart.plot([r.map((_) => 30), r.map((_) => 70), r], {
                    height: args.maxHeight / 2,
                    max: 70,
                    min: 30,
                    padding: padding,
                    colors: [asciichart.blue, asciichart.blue, asciichart.red],
                })
        );

        print(
            `\t RSI ${args.coin} last ${timePast} ${timeName}. Now: ${
                r.slice(-1)[0]
            }`
        );
    }

    if (args.technicalIndicator.includes("MACD")) {
        const m = TI.MACD.calculate({
            values: values,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false,
        });

        const x = [map("MACD", m), map("signal", m)].map(interpolate)
        print(
            "\n" +
                asciichart.plot(x,
                    {
                        height: args.maxHeight / 2,
                        padding: padding,
                        colors: [
                            asciichart.blue,
                            asciichart.red,
                        ],
                    }
                )
        );

        print(
            `\t MACD ${args.coin} last ${timePast} ${timeName}. Now: ${
                x.slice(-1)[0][0]
            }`
        );
    }
};

module.exports = {
    printTechIndicatorChart: printTechIndicatorChart,
    getTechIndicator: getTechIndicator,
    getTechIndicatorColors: getTechIndicatorColors,
};

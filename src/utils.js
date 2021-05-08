const { always, gt, cond, T } = require("lodash/fp");
const { flow, remove, takeRight } = require("lodash/fp");
const { negate, first } = require("lodash/fp");
const args = require("./arguments.js");
const { interpolateArray } = require("array-interpolatejs");

const print = (string) => process.stdout.write(string + "\n");
const id = always;
const normalize = cond([
    [gt(0.0001), id(8)],
    [gt(0.01), id(6)],
    [gt(0.1), id(3)],
    [gt(100), id(2)],
    [T, id(0)],
]);

const time = () =>
    flow(
        remove(negate(first)),
        first
    )([
        [args.mins, "minutes", "histominute"],
        [args.hours, "hours", "histohour"],
        [args.days, "days", "histoday"],
    ]);

const interpolate = (i) =>
    interpolateArray(args.maxWidth)(takeRight(time()[0])(i));

module.exports = {
    print: print,
    normalize: normalize,
    interpolate: interpolate,
    time: time,
};

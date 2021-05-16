import lodash from "lodash/fp.js"
import { interpolateArray } from "array-interpolatejs"
import args from "./arguments.js"

const { always, gt, cond, T } = lodash
const { flow, remove, takeRight } = lodash
const { negate, first } = lodash

export const print = (string) => process.stdout.write(string + "\n")
const id = always
export const normalize = cond([
  [gt(0.0001), id(8)],
  [gt(0.01), id(6)],
  [gt(0.1), id(3)],
  [gt(100), id(2)],
  [T, id(0)],
])

export const time = () =>
  flow(
    remove(negate(first)),
    first
  )([
    [args.mins, "minutes", "histominute"],
    [args.hours, "hours", "histohour"],
    [args.days, "days", "histoday"],
  ])

export const interpolate = (i) =>
  interpolateArray(args.maxWidth)(takeRight(time()[0])(i))

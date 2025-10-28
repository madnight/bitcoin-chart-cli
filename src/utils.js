import args from "./arguments.js"

export const print = (string) => process.stdout.write(string + "\n")

export const normalize = (value) => {
  if (value > 100) return 0
  if (value > 0.1) return 2
  if (value > 0.01) return 3
  if (value > 0.0001) return 6
  return 8
}

export const time = () => {
  const options = [
    [args.mins, "minutes", "histominute"],
    [args.hours, "hours", "histohour"],
    [args.days, "days", "histoday"],
  ]
  return options.find(option => option[0])
}

// Simple linear interpolation implementation
const linearInterpolate = (arr, targetLength) => {
  if (arr.length === 0) return []
  if (arr.length === targetLength) return arr
  
  const result = []
  const step = (arr.length - 1) / (targetLength - 1)
  
  for (let i = 0; i < targetLength; i++) {
    const index = i * step
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.ceil(index)
    
    if (lowerIndex === upperIndex) {
      result.push(arr[lowerIndex])
    } else {
      const fraction = index - lowerIndex
      const interpolated = arr[lowerIndex] * (1 - fraction) + arr[upperIndex] * fraction
      result.push(interpolated)
    }
  }
  
  return result
}

export const interpolate = (arr) => {
  const timePast = time()[0]
  const sliced = arr.slice(-timePast)
  return linearInterpolate(sliced, args.maxWidth)
}

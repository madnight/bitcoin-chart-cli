import axios from "axios"
import chalk from "chalk"
import args from "./arguments.js"

const humanString = (i) =>
  (parseFloat(i) / (i < 1e9 ? 1e6 : 1e9)).toFixed(1) + (i < 1e9 ? "M" : "B")

const percentColor = (i) => (i.includes("-") ? chalk.red(i) : chalk.green(i))

export const printTopList = async () => {
  const { data } = await axios.get("https://api.coincap.io/v2/assets")

  process.stdout.write("Rank  Name                        Price     ")
  console.log("MktCap     Volume   Change/24h")
  console.log("-".repeat(74))
  data.data
    .slice(0, args.topList)
    .forEach((x) =>
      console.log(
        (x.rank + ".").padEnd(5),
        x.name.padEnd(22),
        ("$" + parseFloat(x.priceUsd).toFixed(2)).padStart(10),
        humanString(parseFloat(x.marketCapUsd).toFixed(1)).padStart(10),
        humanString(parseFloat(x.volumeUsd24Hr).toFixed(0)).padStart(10),
        percentColor(
          (parseFloat(x.changePercent24Hr).toFixed(2) + "%").padStart(12)
        )
      )
    )
}

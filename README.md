# bitcoin-chart-cli
[![npm](https://img.shields.io/npm/v/bitcoin-chart-cli.svg)](https://npmjs.com/package/bitcoin-chart-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/madnight/bitcoin-chart-cli.svg?branch=master)](https://travis-ci.org/madnight/bitcoin-chart-cli)
[![Issue Count](https://codeclimate.com/github/madnight/bitcoin-chart-cli/badges/issue_count.svg?maxAge=2592000)](https://codeclimate.com/github/madnight/bitcoin-chart-cli/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/madnight/bitcoin-chart-cli/badge.svg)](https://snyk.io/test/github/madnight/bitcoin-chart-cli)
[![dependencies Status](https://david-dm.org/madnight/bitcoin-chart-cli/status.svg)](https://david-dm.org/madnight/bitcoin-chart-cli)
[![bitHound Overall Score](https://www.bithound.io/github/madnight/bitcoin-chart-cli/badges/score.svg)](https://www.bithound.io/github/madnight/bitcoin-chart-cli)


Bitcoin chart for the terminal as command line util

For a list of supported cryptocurrencies see [coins](COINS.md)

### Requirements
 * node 8.0 or higher (need fancy syntax features thats why 8+)
 * npm or yarn

### Usage

```bash
# install
npm install bitcoin-chart-cli -g

# (alternative) install with yarn
yarn global add bitcoin-chart-cli

# run default
bitcoin-chart-cli

# run with options
bitcoin-chart-cli --coin ETH -d 360 -w 80 -h 20
```

### Options
```bash
bitcoin-chart-cli --help


  Usage: index [options]


  Options:

    -V, --version           output the version number
    -d, --days <n>          number of days the chart will go back
    --hours <n>             number of hours the chart will go back
    --mins <n>              number of minutes the chart will go back
    -w, --width <n>         max terminal chart width
    -h, --height <n>        max terminal chart height
    -c, --coin <string>     specify the coin e.g. ETH
    -m, --currency <string> specify the trading pair currency (Default: USD)
    --disable-legend        disable legend text
    -h, --help              output usage information
```
# Examples

![](https://i.imgur.com/8jXYkHc.png)

```bash
bitcoin-chart-cli
```

![](https://i.imgur.com/gg5kRYG.png)

```bash
bitcoin-chart-cli --coin LTC
```

![](https://i.imgur.com/cTtFxy6.png)

```bash
In combination with conky
conky.text = [[ ${execi 120 bitcoin-chart-cli --coin ETH -w 140 -h 15} ]];
```
More examples https://travis-ci.org/madnight/bitcoin-chart-cli

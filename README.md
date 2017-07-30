# bitcoin-chart-cli
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/madnight/bitcoin-chart-cli.svg?branch=master)](https://travis-ci.org/madnight/bitcoin-chart-cli)
[![Issue Count](https://codeclimate.com/github/madnight/bitcoin-chart-cli/badges/issue_count.svg?maxAge=2592000)](https://codeclimate.com/github/madnight/bitcoin-chart-cli/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/madnight/bitcoin-chart-cli/badge.svg)](https://snyk.io/test/github/madnight/bitcoin-chart-cli)
[![dependencies Status](https://david-dm.org/madnight/bitcoin-chart-cli/status.svg)](https://david-dm.org/madnight/bitcoin-chart-cli)
[![bitHound Overall Score](https://www.bithound.io/github/madnight/bitcoin-chart-cli/badges/score.svg)](https://www.bithound.io/github/madnight/bitcoin-chart-cli)


Bitcoin chart for the terminal as command line util

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
bitcoin-chart-cli -d 360 -w 80 -h 20
```

### Options
```bash
bitcoin-chart-cli --help
    
  Usage: index [options]


  Options:

    -V, --version      output the version number
    -d, --days <n>     number of days the chart will go back
    --hours <n>        number of hours the chart will go back
    --mins <n>         number of minutes the chart will go back
    -w, --width <n>    max terminal chart width
    -h, --height <n>   max terminal chart height
    --disable-legend   disable legend text
    --antshares        show antshares chart
    --bytecoin         show bytecoin chart
    --bitcoin          show bitcoin chart
    --bitshares        show bitshares chart
    --dash             show dash chart
    --antshares        show antshares chart
    --digibyte         show digibyte chart
    --dogecoin         show dogecoin chart
    --eos              show eos chart
    --ethereumClassic  show ethereumClassic chart
    --ethereum         show ethereum chart
    --gnosis           show gnosis chart
    --golem            show golem chart
    --iota             show iota chart
    --iconomi          show iconomi chart
    --litecoin         show litecoin chart
    --metal            show metal chart
    --peercoin         show peercoin chart
    --qtum             show qtum chart
    --siacoin          show siacoin chart
    --status           show status chart
    --stratis          show stratis chart
    --steem            show steem chart
    --viacoin          show viacoin chart
    --waves            show waves chart
    --nem              show nem chart
    --primecoin        show primecoin chart
    --monero           show monero chart
    --ripple           show ripple chart
    --zcash            show zcash chart
    -h, --help         output usage information

```
# Examples

![](https://i.imgur.com/8jXYkHc.png)

```bash
bitcoin-chart-cli
```

![](https://i.imgur.com/gg5kRYG.png)

```bash
bitcoin-chart-cli --litecoin
```

![](https://i.imgur.com/cTtFxy6.png)

```bash
In combination with conky
conky.text = [[ ${execi 120 bitcoin-chart-cli --ethereum -w 140 -h 15} ]];
```

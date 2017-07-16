# bitcoin-chart-cli
[![Build Status](https://travis-ci.org/madnight/bitcoin-chart-cli.svg?branch=master)](https://travis-ci.org/madnight/bitcoin-chart-cli)

Bitcoin chart for the terminal as command line util

### Requirements
 * node 8.0 or higher (need fancy syntax features thats why 8+)
 * npm or yarn

### Usage

```bash
# install
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

    -V, --version     output the version number
    -d, --days <n>    number of days the chart will go back
    -w, --width <n>   max terminal chart width
    -h, --height <n>  max terminal chart height
    -e, --ethereum    show ethereum chart instead of bitoin
    -l, --litecoin    show litecoin chart instead of bitoin
    -r, --ripple      show ripple chart instead of bitoin
    --disable-legend  disable legend text
    -h, --help        output usage information

```
# Examples

![](https://i.imgur.com/8jXYkHc.png)

```bash
bitcoin-chart-cli
```

![](https://i.imgur.com/gg5kRYG.png)

```bash
bitcoin-chart-cli --l
```

![](https://i.imgur.com/cTtFxy6.png)

```bash
In combination with conky
conky.text = [[ ${execi 120 bitcoin-chart-cli -e -w 140 -h 15} ]];
```

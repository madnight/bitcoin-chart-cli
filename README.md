# bitcoin-chart-cli
[![Build Status](https://travis-ci.org/madnight/bitcoin-chart-cli.svg?branch=master)](https://travis-ci.org/madnight/bitcoin-chart-cli)

Bitcoin chart for the terminal as command line util

### Requirements
 * node 8.0 or higher (need fancy syntax features thats why 8+)
 * npm or yarn

### Usage

```bash
# install with npm
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

  Usage: bitcoin-chart-cli [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -d, --days <n>    number of days the chart will go back
    -w, --width <n>   max terminal chart width
    -h, --height <n>  max terminal chart height
```

```bash
3018.55 ┤                                                                     ╭╮
2881.42 ┤                                                                ╭╮╭──╯│
2744.29 ┤                                                               ╭╯╰╯   ╰─╮     ╭───╮
2607.17 ┤                                                             ╭─╯        │  ╭──╯   ╰─╮╭──
2470.04 ┤                                                   ╭╮      ╭─╯          ╰──╯        ╰╯
2332.91 ┤                                                  ╭╯╰╮  ╭╮╭╯
2195.79 ┤                                                 ╭╯  ╰╮╭╯╰╯
2058.66 ┤                                               ╭─╯    ╰╯
1921.53 ┤                                             ╭─╯
1784.41 ┤                                     ╭─╮╭─╮╭─╯
1647.28 ┤                                   ╭─╯ ╰╯ ╰╯
1510.16 ┤                             ╭─────╯
1373.03 ┤                        ╭────╯
1235.90 ┤   ╭────────────────────╯
1098.78 ┼───╯
		 Bitcoin Chart from 2017-04-02 to 2017-07-01
```

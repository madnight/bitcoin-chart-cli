const BFX                           = require('bitfinex-api-node')
const clear                         = require('clear')
const asciichart                    = require('asciichart')
const { print }                     = require('./utils.js')

const livePrice = (maxWidth, maxHeight) => {

    const prices = []
    // eslint-disable-next-line better/no-new
    const ws = new BFX({ transform: true }).ws()

    ws.on('error', (err) => print(err))
    ws.on('open', () => ws.subscribeTrades('BTCUSD'))

    ws.onTradeUpdate({ pair: 'BTCUSD' }, trades => {
        const price = trades[0].price
        /* eslint-disable fp/no-mutating-methods */
        prices.push(price)
        prices.length > maxWidth && prices.shift()
        /* eslint-enable fp/no-mutating-methods */
        return prices.length > 10 && (() => {
            clear()
            print(asciichart.plot (prices, {height: maxHeight}))
            return print(`\t\t\t Bitfinex Live BTC/USD Price: $${price}`)
        })()
    })

    return ws.open()
}

module.exports = {
    livePrice: livePrice
}


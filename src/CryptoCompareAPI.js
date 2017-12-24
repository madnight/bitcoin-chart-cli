const { get, map, flow } = require('lodash/fp')
const axios              = require('axios')
const queryString        = require('query-string')

class CryptoCompareAPI {

    static baseURL() {
        return 'https://min-api.cryptocompare.com/data/'
    }

    static History(time, coin, currency, past) {
        return this.baseURL() + time + '?' +
            queryString.stringify({ fsym: coin, tsym: currency, limit: past })
    }

    static Current(coin, currency) {
        return this.baseURL() + 'price?' +
            queryString.stringify({ fsym: coin, tsyms: currency })
    }

    static CoinList() {
        return 'https://www.cryptocompare.com/api/data/coinlist'
    }

    static async fetchCoinList() {
        return flow(
            get('data.Data'),
            map('FullName')
        )(await axios.get(CryptoCompareAPI.CoinList()))
    }

    static async fetchCoinHistory(time, coin, currency, past) {
        return flow(
            get('data.Data'),
            map('close')
        )(await axios.get(
            CryptoCompareAPI.History(time, coin, currency, past)))
    }

    static async fetchCoinPrice(coin, currency) {
        return (await axios.get(CryptoCompareAPI.Current(coin, currency))).data
    }
}

module.exports = { CryptoCompareAPI: CryptoCompareAPI }

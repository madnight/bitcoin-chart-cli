const { get, map, flow } = require('lodash/fp')
const axios              = require('axios')

class CryptoCompareAPI {

    // API Urls
    static baseURL() {
        return 'https://min-api.cryptocompare.com/data/'
    }

    static History(time, coin, currency, past) {
        return `${CryptoCompareAPI.baseURL()}${time}?fsym=${coin}`
            + `&tsym=${currency}&limit=${past}&e=CCCAGG`
    }

    static Current(coin, currency) {
        return `${CryptoCompareAPI.baseURL()}`
            + `price?fsym=${coin}&tsyms=${currency}`
    }

    static CoinList() {
        return `${CryptoCompareAPI.baseURL()}` + 'all/coinlist'
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

const { get, map, flow } = require("lodash/fp");
const axios = require("axios");

class CryptoCompareAPI {
    // API Urls
    static baseURL() {
        return "https://min-api.cryptocompare.com/data/";
    }

    static apiKey() {
        return process.env.CRYPTOCOMPARE_API_KEY
            ? `&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`
            : "";
    }

    static History(time, coin, currency, past) {
        return (
            `${CryptoCompareAPI.baseURL()}${time}?fsym=${coin}` +
            `&tsym=${currency}&limit=${past}&e=CCCAGG` +
            CryptoCompareAPI.apiKey()
        );
    }

    static Current(coin, currency) {
        return (
            `${CryptoCompareAPI.baseURL()}` +
            `price?fsym=${coin}&tsyms=${currency}` +
            CryptoCompareAPI.apiKey()
        );
    }

    static CoinList() {
        return (
            `${CryptoCompareAPI.baseURL()}` +
            "all/coinlist" +
            CryptoCompareAPI.apiKey()
        );
    }

    static async fetchCoinList() {
        return flow(
            get("data.Data"),
            map("FullName")
        )(await axios.get(CryptoCompareAPI.CoinList()));
    }

    static async fetchCoinHistory(time, coin, currency, past) {
        const { data } = await axios.get(
            CryptoCompareAPI.History(time, coin, currency, past)
        );
        if (data.Response == "Error") {
            console.log(data.Message);
            process.exit(1);
        }
        return data.Data.map(d => d.close)
    }

    static async fetchCoinPrice(coin, currency) {
        return (await axios.get(CryptoCompareAPI.Current(coin, currency))).data;
    }
}

module.exports = { CryptoCompareAPI: CryptoCompareAPI };

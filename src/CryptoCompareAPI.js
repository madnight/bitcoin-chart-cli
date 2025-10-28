export class CryptoCompareAPI {
  // API Urls
  static baseURL() {
    return "https://min-api.cryptocompare.com/data/"
  }

  static apiKey() {
    return process.env.CRYPTOCOMPARE_API_KEY
      ? `&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`
      : ""
  }

  static History(time, coin, currency, past) {
    return (
      `${CryptoCompareAPI.baseURL()}${time}?fsym=${coin}` +
      `&tsym=${currency}&limit=${past + 50}&e=CCCAGG` +
      CryptoCompareAPI.apiKey()
    )
  }

  static Current(coin, currency) {
    return (
      `${CryptoCompareAPI.baseURL()}` +
      `price?fsym=${coin}&tsyms=${currency}` +
      CryptoCompareAPI.apiKey()
    )
  }

  static CoinList() {
    return (
      `${CryptoCompareAPI.baseURL()}` +
      "all/coinlist" +
      CryptoCompareAPI.apiKey()
    )
  }

  static async fetchCoinList() {
    const response = await fetch(CryptoCompareAPI.CoinList())
    const json = await response.json()
    return Object.values(json.Data).map(coin => coin.FullName)
  }

  static async fetchCoinHistory(time, coin, currency, past) {
    const response = await fetch(
      CryptoCompareAPI.History(time, coin, currency, past)
    )
    const data = await response.json()
    if (data.Response == "Error") {
      console.log(data.Message)
      process.exit(1)
    }
    return data.Data.map((d) => d.close)
  }

  static async fetchCoinPrice(coin, currency) {
    const response = await fetch(CryptoCompareAPI.Current(coin, currency))
    return await response.json()
  }
}

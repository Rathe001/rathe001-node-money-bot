const config = {
  baseApi: 'https://paper-api.alpaca.markets',
  maxStocks: 5000,
  normalizedMax: 20, // 10 stocks at $4 each, or 1 stock at $40
  profitMargin: 0.01, // 1%
  throttleDelay: 1000,
  tick: 10000,
  ticker: [
    'GPRO',
    'F',
    'FIT',
    'AABA',
    'GE',
    'WTI',
    'DUST',
    'VIXY',
    'RDFN',
    'KMDA',
    'YAHOY',
    'PAYS',
    'INTZ',
    'ELMD',
    'EDAP',
    'CXDO',
    'JCS',
  ],
};

export default config;

const config = {
  baseApi: 'https://paper-api.alpaca.markets',
  maxStocks: 5000,
  normalizedMax: 20, // 10 stocks at $4 each, or 1 stock at $40
  profitMargin: 0.01, // 1%
  tick: 500,
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
    'PAYS',
    'ELMD',
    'EDAP',
    'JCS',
  ],
};

export default config;

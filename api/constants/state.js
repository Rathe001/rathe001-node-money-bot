const state = {
  app: {
    ticks: 0,
    buys: 0,
    sells: 0,
    profit: 0,
    buyTotal: 0,
    sellTotal: 0,
    updated: null,
    positions: [],
    status: 'LOADING',
  },
  quotes: {},
  history: {},
};

export default state;

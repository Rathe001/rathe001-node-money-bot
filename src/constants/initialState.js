export const initialState = {
  app: {
    ticks: 0,
    buys: 0,
    sells: 0,
    buyTotal: 0,
    sellTotal: 0,
    profit: 0,
    updated: null,
    positions: [],
    sellOrders: [],
    buyOrders: [],
  },
  quotes: {},
  history: {},
};

export default initialState;

export const initialState = {
  account: {
    cash: '0',
    pattern_day_trader: false,
  },
  clock: {
    is_open: true,
  },
  data: {
    buys: [],
    sells: [],
  },
  isBuyInProgress: false,
  orders: [],
  profit: 0,
  quotes: {
    '15min': {},
    '1min': {},
    '5min': {},
    current: {},
    day: {},
  },
  sellId: null,
  status: 'RUNNING',
  ticks: 0,
  updated: null,
};

export default initialState;

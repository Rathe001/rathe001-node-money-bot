const state = {
  app: {
    ticks: 0,
    buys: 0,
    sells: 0,
    buyTotal: 0,
    sellTotal: 0,
    updated: null,
    //positions: [],
    positions: [
      {
        sym: 'TEST',
        cost: 123.45,
        uuid: Math.random(),
        date: 'Aug 1',
      },
      {
        sym: 'TEST',
        cost: 123.42,
        uuid: Math.random(),
        date: 'Aug 2',
      },
    ],
  },
  quotes: {},
  history: {},
};

export default state;

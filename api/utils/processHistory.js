import state from '../constants/state';

const processHistory = (timeframe, data) => {
  const reducedData = Object.keys(data).reduce(
    (obj, key) => ({
      ...obj,
      [key]: data[key][0],
    }),
    {},
  );

  state.quotes[timeframe] = reducedData;
};

export default processHistory;

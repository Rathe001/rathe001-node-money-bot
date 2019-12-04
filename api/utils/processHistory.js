import state from '../constants/state';

const processHistory = (timeframe, data) => {
  state.history[timeframe] = data;
};

export default processHistory;

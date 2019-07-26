import state from '../constants/state';
import config from '../constants/config';

const processHistory = (timeframe, data) => {
  state.history[timeframe] = data[config.ticker][0];
};

export default processHistory;

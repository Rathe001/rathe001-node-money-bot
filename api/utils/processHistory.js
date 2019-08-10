import state from '../constants/state';
import config from '../constants/config';

const processHistory = (timeframe, data) => {
  state.history[timeframe] = data;
};

export default processHistory;

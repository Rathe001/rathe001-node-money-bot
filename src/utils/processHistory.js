import state from '../constants/state';
import config from '../constants/config';
import updateStatus from './updateStatus';

const processHistory = (timeframe, data) => {
  state.history[timeframe] = data[config.ticker][0];
  updateStatus('Updated history');
};

export default processHistory;

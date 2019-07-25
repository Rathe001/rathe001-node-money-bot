import state from '../constants/state';
import updateStatus from '../utils/updateStatus';

const onStockQuotes = (subject, data) => {
  state.quotes = {
    ...state.quotes,
    [subject]: data,
  };

  updateStatus('Updated quotes');
};

export default onStockQuotes;

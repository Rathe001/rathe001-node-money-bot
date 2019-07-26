import state from '../constants/state';
import config from '../constants/config';

const sellStock = stock => {
  const sellCurrent = state.quotes[`Q.${config.ticker}`].bp;

  state.ui.sells += 1;
  state.ui.sellTotal += sellCurrent;

  state.ui.wallet = state.ui.wallet.filter(item => item.uuid !== stock.uuid);
};

export default sellStock;

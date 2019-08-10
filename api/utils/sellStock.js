import state from '../constants/state';
import config from '../constants/config';

const sellStock = stock => {
  const sellCurrent = state.quotes[`Q.${config.ticker}`].bp;

  state.app.sells += 1;
  state.app.sellTotal += sellCurrent;

  state.app.positions = state.app.positions.filter(item => item.uuid !== stock.uuid);
};

export default sellStock;

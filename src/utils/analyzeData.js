import config from '../constants/config';
import state from '../constants/state';
import buyStock from '../utils/buyStock';
import sellStock from '../utils/sellStock';

const shouldBuy = () => {
  const buyCurrent = state.quotes[`Q.${config.ticker}`].ap;
  const buy1min = state.history['1min'].o;
  const buy5min = state.history['5min'].o;
  const buy15min = state.history['15min'].o;
  const buyDay = state.history['day'].o;

  return buyCurrent < buy1min && buy1min < buy5min && buy5min < buy15min && buy15min < buyDay;
};

const shouldSell = () => {};

const analyzeData = () => {
  // Buy?
  if (shouldBuy()) {
    buyStock();
  }

  // Sell?
  state.ui.wallet.forEach(stock => {
    if (shouldSell()) {
      sellStock(stock);
    }
  });
};

export default analyzeData;

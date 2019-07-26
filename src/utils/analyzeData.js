import moment from 'moment';
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

  return (
    buyCurrent < buy1min &&
    buy1min < buy5min &&
    buy5min < buy15min &&
    buy15min < buyDay &&
    state.ui.wallet.length < config.maxStocks
  );
};

const shouldSell = stock => {
  const sellCurrent = state.quotes[`Q.${config.ticker}`].bp;

  return sellCurrent >= stock.cost * config.profitMargin;
};

const analyzeData = () => {
  // Buy?
  if (shouldBuy()) {
    buyStock();
  }

  // Sell?
  state.ui.wallet.forEach(stock => {
    if (shouldSell(stock)) {
      sellStock(stock);
    }
  });

  state.ui.updated = moment().format('MMMM Do YYYY, h:mm:ss a');
  state.ui.ticks += 1;
};

export default analyzeData;

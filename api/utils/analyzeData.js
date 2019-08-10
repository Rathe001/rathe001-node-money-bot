import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';
import buyStock from '../utils/buyStock';
import sellStock from '../utils/sellStock';

const checkShouldBuy = () => {
  Object.keys(state.quotes).forEach(ticker => {
    const buyCurrent = state.quotes[ticker].ap;
    const buy1min = state.history['1min'][ticker][0].o;
    const buy5min = state.history['5min'][ticker][0].o;
    const buy15min = state.history['15min'][ticker][0].o;
    const buyDay = state.history['day'][ticker][0].o;

    if (
      buyCurrent < buy1min &&
      buy1min < buy5min &&
      buy5min < buy15min &&
      buy15min < buyDay &&
      state.app.positions.length < config.maxStocks
    ) {
      buyStock(ticker);
    }
  });
};

const checkShouldSell = stock => {
  const sellCurrent = (state.quotes[stock.sym] && state.quotes[stock.sym].bp) || 0;
  if (sellCurrent >= stock.cost * config.profitMargin) {
    sellStock(stock);
  }
};

const analyzeData = () => {
  // Buy?
  checkShouldBuy();

  // Sell?
  state.app.positions.forEach(stock => {
    checkShouldSell(stock);
  });

  state.app.updated = moment().format('MMMM Do YYYY, h:mm:ss a');
  state.app.ticks += 1;
};

export default analyzeData;

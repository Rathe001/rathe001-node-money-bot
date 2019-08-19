import moment from 'moment';
import storage from 'node-persist';
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
  const daysOld = moment().diff(moment(stock.date), 'days');
  const sellCurrent = (state.quotes[stock.sym] && state.quotes[stock.sym].bp) || 0;

  // Stock should be 24h old to avoid being flagged as a day trader
  if (daysOld >= 1 && sellCurrent >= stock.cost * (1 + config.profitMargin / daysOld)) {
    sellStock(stock);
  }
};

const analyzeData = async () => {
  // Buy?
  checkShouldBuy();

  // Sell?
  state.app.positions.forEach(stock => {
    checkShouldSell(stock);
  });

  state.app.updated = moment().format('MMMM Do YYYY, h:mm:ss a');
  state.app.ticks += 1;
  await storage.setItem('app', state.app);
};

export default analyzeData;

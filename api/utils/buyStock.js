import uuid from 'uuid/v4';
import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const buyStock = ticker => {
  const buyCurrent = state.quotes[ticker].ap;
  const qty =
    config.normalizedMax / buyCurrent < 1 ? 1 : (config.normalizedMax / buyCurrent).toFixed(0);

  alpaca
    .createOrder({
      symbol: ticker, // any valid ticker symbol
      qty,
      side: 'buy',
      type: 'market',
      time_in_force: 'day',
    })
    .then(order => {
      console.log(`${moment().format()}: ${order.symbol} buy order for ${qty} at ${buyCurrent}`);
      state.app.buyOrders.push({
        ...order,
        buyCurrent,
      });
      state.didTransaction = true;
    });
};

export default buyStock;

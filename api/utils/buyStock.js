import uuid from 'uuid/v4';
import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const buyStock = ticker => {
  const buyCurrent = state.quotes[ticker].ap;

  alpaca
    .createOrder({
      symbol: ticker, // any valid ticker symbol
      qty: 1,
      side: 'buy',
      type: 'market',
      time_in_force: 'day',
    })
    .then(order => {
      console.log(`${moment().format()}: ${order.symbol} buy order for ${buyCurrent}`);
      state.app.buyOrders.push(order);
    });
};

export default buyStock;

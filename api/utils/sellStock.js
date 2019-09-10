import state from '../constants/state';
import alpaca from '../constants/alpaca';
import moment from 'moment';

const sellStock = stock => {
  const sellCurrent = state.quotes[stock.symbol].bp;

  alpaca
    .createOrder({
      symbol: stock.symbol,
      qty: 1,
      side: 'sell',
      type: 'market',
      time_in_force: 'day',
    })
    .then(order => {
      console.log(`${moment().format()}: Selling ${order.symbol} for ${sellCurrent}`);
      state.app.positions = state.app.positions.filter(item => item.id !== stock.id);
      state.app.sellOrders.push({
        ...order,
        cost: stock.filled_avg_price,
      });
    });
};

export default sellStock;

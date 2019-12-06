import moment from 'moment';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const sellStock = stock => {
  const sellCurrent = state.quotes[stock.symbol].bp;

  alpaca
    .createOrder({
      qty: stock.filled_qty,
      side: 'sell',
      symbol: stock.symbol,
      time_in_force: 'day',
      type: 'market',
    })
    .then(order => {
      // eslint-disable-next-line no-console
      console.log(
        `${moment().format()}: ${order.symbol} sell order for ${
          stock.filled_qty
        } at ${sellCurrent}`,
      );

      state.didTransaction = true;
    });
};

export default sellStock;

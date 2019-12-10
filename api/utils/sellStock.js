import alpaca from '../constants/alpaca';
import state from '../constants/state';

const sellStock = order => {
  state.sellId = order.id;

  console.log(`${order.symbol} sell order for ${order.filled_qty}`);
  alpaca
    .createOrder({
      qty: order.filled_qty,
      side: 'sell',
      symbol: order.symbol,
      time_in_force: 'day',
      type: 'market',
    })
    .catch(() => {
      state.sellId = null;
    });
};

export default sellStock;

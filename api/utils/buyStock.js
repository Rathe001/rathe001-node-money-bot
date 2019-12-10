import config from '../constants/config';
import state from '../constants/state';
import alpaca from '../constants/alpaca';

const buyStock = ticker => {
  const buyCurrent = state.quotes.current[ticker].ap;
  const qty =
    config.normalizedMax / buyCurrent < 1 ? 1 : (config.normalizedMax / buyCurrent).toFixed(0);

  state.isBuyInProgress = true;
  console.log(`${ticker} buy order for ${qty} at $${buyCurrent}`);

  alpaca
    .createOrder({
      qty,
      side: 'buy',
      symbol: ticker,
      time_in_force: 'day',
      type: 'market',
    })
    .catch(() => {
      console.log(`${ticker} buy order for ${buyCurrent} FAILED`);
      state.isBuyInProgress = false;
    });
};

export default buyStock;

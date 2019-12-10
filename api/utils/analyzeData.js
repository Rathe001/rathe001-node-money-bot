import storage from 'node-persist';
import state from '../constants/state';
import buyStock from './buyStock';
import sellStock from './sellStock';
import {
  isLowestPosition,
  isNoPendingBuyOrders,
  isBelowMaxPositions,
  isEnoughCash,
  isDailyPercentageDown,
  isLowOfTheDay,
  isLargeRecentDrop,
} from './buyConditions';
import { isNoPendingSellOrders, isDayOld, isProfitable } from './sellConditions';

const checkShouldBuy = () => {
  Object.keys(state.quotes.current).forEach(ticker => {
    if (state.quotes['1min'][ticker] && state.quotes.current[ticker]) {
      const buyCurrent = state.quotes.current[ticker].ap;
      const buy1min = state.quotes['1min'][ticker].o;
      const buy5min = state.quotes['5min'][ticker].o;
      const buy15min = state.quotes['15min'][ticker].o;
      const buyDay = state.quotes.day[ticker].o;
      const existingOrders = state.orders.filter(p => p.symbol === ticker);
      const lowestPosition = existingOrders.length
        ? existingOrders.reduce(
            (min, p) =>
              parseFloat(p.filled_avg_price) < min ? parseFloat(p.filled_avg_price) : min,
            9999,
          )
        : 9999;
      if (
        isLowestPosition(lowestPosition, buyCurrent) &&
        isNoPendingBuyOrders(ticker) &&
        (isBelowMaxPositions() || isDailyPercentageDown(buyCurrent, buyDay)) &&
        isEnoughCash(buyCurrent) &&
        (isLowOfTheDay(buyCurrent, buy1min, buy5min, buy15min, buyDay) ||
          isLargeRecentDrop(buyCurrent, buy1min, buy5min) ||
          existingOrders.length > 0)
      ) {
        buyStock(ticker);
      }
    }
  });
};

const checkShouldSell = position => {
  const sellCurrent =
    (state.quotes.current[position.symbol] && state.quotes.current[position.symbol].bp) || 0;

  // Stock should be 24h old to avoid being flagged as a day trader
  if (isNoPendingSellOrders() && isDayOld(position) && isProfitable(position, sellCurrent)) {
    sellStock(position);
  }
};

const analyzeData = async () => {
  // Buy?
  checkShouldBuy();

  // Sell?
  state.orders.forEach(stock => {
    checkShouldSell(stock);
  });

  state.ticks += 1;
  await storage.setItem('app', state);
};

export default analyzeData;

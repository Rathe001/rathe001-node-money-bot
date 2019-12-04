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
import { isDayOld, isProfitable } from './sellConditions';

const checkShouldBuy = () => {
  Object.keys(state.quotes).forEach(ticker => {
    if (state.history['1min'][ticker] && state.quotes[ticker]) {
      const buyCurrent = state.quotes[ticker].ap;
      const buy1min = state.history['1min'][ticker][0].o;
      const buy5min = state.history['5min'][ticker][0].o;
      const buy15min = state.history['15min'][ticker][0].o;
      const buyDay = state.history.day[ticker][0].o;
      const tickerPositions = state.app.positions.filter(p => p.symbol === ticker);
      const lowestPosition = tickerPositions.length
        ? tickerPositions.reduce(
            (min, p) =>
              parseFloat(p.filled_avg_price) < min ? parseFloat(p.filled_avg_price) : min,
            9999,
          )
        : 9999;

      if (
        isLowestPosition(lowestPosition, buyCurrent) &&
        // or isLoweringTheAverage
        isNoPendingBuyOrders(ticker) &&
        (isBelowMaxPositions() || isDailyPercentageDown(buyCurrent, buyDay)) &&
        isEnoughCash(buyCurrent) &&
        (isLowOfTheDay(buyCurrent, buy1min, buy5min, buy15min, buyDay) ||
          isLargeRecentDrop(buyCurrent, buy1min, buy5min) ||
          tickerPositions.length > 0)
      ) {
        buyStock(ticker);
      }
    }
  });
};

const checkShouldSell = stock => {
  const sellCurrent = (state.quotes[stock.symbol] && state.quotes[stock.symbol].bp) || 0;

  // Stock should be 24h old to avoid being flagged as a day trader
  if (isDayOld(stock) && isProfitable(stock, sellCurrent)) {
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

  state.app.ticks += 1;
  await storage.setItem('app', state.app);
};

export default analyzeData;

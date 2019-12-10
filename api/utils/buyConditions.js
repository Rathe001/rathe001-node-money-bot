import state from '../constants/state';
import config from '../constants/config';

export const isLowestPosition = (lowestPosition, buyCurrent) => lowestPosition > buyCurrent;

export const isNoPendingBuyOrders = ticker =>
  state.orders.filter(o => o.symbol === ticker && o.status === 'new').length === 0;

export const isBelowMaxPositions = () => state.orders.length < config.maxStocks;

export const isEnoughCash = buyCurrent => {
  const normalizedCount =
    config.normalizedMax / buyCurrent < 1 ? 1 : (config.normalizedMax / buyCurrent).toFixed(0);

  return state.account.cash > buyCurrent * normalizedCount;
};

export const isBuyInProgress = () => state.isBuyInProgress;

export const isDailyPercentageDown = (buyCurrent, buyDay) => 1 - buyCurrent / buyDay >= 0.01;

export const isLowOfTheDay = (buyCurrent, buy1min, buy5min, buy15min, buyDay) =>
  buyCurrent <= buy1min && buy1min <= buy5min && buy5min <= buy15min && buy15min <= buyDay;

export const isLargeRecentDrop = (buyCurrent, buy1min, buy5min) =>
  1 - buyCurrent / buy1min > 0.1 || 1 - buyCurrent / buy5min > 0.1;

export default {
  isBelowMaxPositions,
  isDailyPercentageDown,
  isEnoughCash,
  isLargeRecentDrop,
  isLowOfTheDay,
  isLowestPosition,
  isNoPendingBuyOrders,
};

import moment from 'moment';
import config from '../constants/config';

export const isDayOld = stock => moment().diff(moment(stock.filled_at), 'days') >= 1;

export const isProfitable = (stock, sellCurrent) =>
  sellCurrent >=
  parseFloat(stock.filled_avg_price) *
    (1 + config.profitMargin / moment().diff(moment(stock.filled_at), 'days'));

export default {
  isDayOld,
  isProfitable,
};

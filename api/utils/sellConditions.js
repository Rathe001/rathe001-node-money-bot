import moment from 'moment';
import state from '../constants/state';
import config from '../constants/config';

export const isDayOld = position => moment().diff(moment(position.filled_at), 'days') >= 1;

export const sellOrderExists = position => !!state.app.sellOrders.find(o => o.id === position.id);

export const isProfitable = (position, sellCurrent) =>
  sellCurrent >=
  parseFloat(position.filled_avg_price) *
    (1 + config.profitMargin / moment().diff(moment(position.filled_at), 'days'));

export default {
  isDayOld,
  isProfitable,
};

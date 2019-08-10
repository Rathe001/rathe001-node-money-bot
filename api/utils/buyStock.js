import uuid from 'uuid/v4';
import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';

const buyStock = ticker => {
  const buyCurrent = state.quotes[ticker].ap;
  state.app.buys += 1;
  state.app.buyTotal += buyCurrent;
  state.app.positions.push({
    sym: ticker,
    cost: buyCurrent,
    uuid: uuid(),
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
  });
};

export default buyStock;

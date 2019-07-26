import uuid from 'uuid/v4';
import moment from 'moment';
import config from '../constants/config';
import state from '../constants/state';

const buyStock = cost => {
  const buyCurrent = state.quotes[`Q.${config.ticker}`].ap;

  state.ui.buys += 1;
  state.ui.buyTotal += buyCurrent;
  state.ui.wallet.push({
    cost: buyCurrent,
    uuid: uuid(),
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
  });
};

export default buyStock;

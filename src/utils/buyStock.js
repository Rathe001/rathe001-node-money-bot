import state from '../constants/state';

const buyStock = () => {
  state.ui.buys += 1;
  state.ui.buyTotal += stock.cost;
};

export default buyStock;

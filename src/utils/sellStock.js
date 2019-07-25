import state from '../constants/state';

const sellStock = stock => {
  state.ui.sells += 1;
  state.ui.sellTotal += stock.cost;
};

export default sellStock;

import state from '../constants/state';

const onStockQuotes = (subject, data) => {
  const jsonDataReduced = JSON.parse(data).reduce(
    (acc, item) => ({ ...acc, [item.sym]: item }),
    {},
  );
  state.quotes.current = {
    ...state.quotes.current,
    ...jsonDataReduced,
  };
};

export default onStockQuotes;

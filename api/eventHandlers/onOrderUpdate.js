import state from '../constants/state';

const onOrderUpdate = rs => {
  if (rs) {
    if (rs.event === 'new') {
      if (rs.order.side === 'buy') {
        state.app.buyOrders.push(rs.order);
      } else if (rs.order.side === 'sell') {
        state.app.sellOrders.push(rs.order);
      }
    } else if (rs.event === 'fill') {
      if (rs.order.side === 'buy') {
        console.log(`${rs.order.symbol} buy order fulfilled for ${rs.order.filled_avg_price}`);
        state.app.buys += 1;
        state.app.positions.push(rs.order);
        state.app.buyOrders = state.app.buyOrders.filter(o => o.id !== rs.order.id);
      } else if (rs.order.side === 'sell') {
        const position = state.app.positions.filter(o => o.id === rs.order.id);
        console.log(`${rs.order.symbol} sell order fulfilled for ${rs.order.filled_avg_price}`);
        state.app.sells += 1;
        state.app.profit +=
          parseFloat(rs.order.filled_avg_price) - parseFloat(position.filled_avg_price);
        state.app.positions = state.app.positions.filter(o => o.id !== rs.order.id);
        state.app.sellOrders = state.app.sellOrders.filter(o => o.id !== rs.order.id);
      }
    } else {
      if (rs.order.side === 'buy') {
        state.app.positions = state.app.positions.filter(o => o.id !== rs.order.id);
      } else if (rs.order.side === 'sell') {
        state.app.positions.push(rs.order);
      }
      state.app.sellOrders = state.app.sellOrders.filter(o => o.id !== rs.order.id);
      state.app.buyOrders = state.app.buyOrders.filter(o => o.id !== rs.order.id);
    }
  }
};

export default onOrderUpdate;

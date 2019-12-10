import state from '../constants/state';
import moment from '../../node_modules/moment/moment';

const onOrderUpdate = rs => {
  if (rs) {
    if (rs.event !== 'new' && rs.event !== 'fill' && rs.event !== 'partial_fill') {
      if (rs.order.side === 'buy') {
        state.isBuyInProgress = false;
      } else if (rs.order.side === 'sell') {
        state.sellId = null;
      }
      return;
    }

    if (rs.event === 'fill') {
      if (rs.order.side === 'buy') {
        console.log(
          `${rs.order.symbol} buy order fulfilled for ${rs.order.filled_qty} at $${rs.order.filled_avg_price}`,
        );
        state.data.buys.push({
          date: rs.order.filled_at,
          qty: Number(rs.order.filled_qty),
          symbol: rs.order.symbol,
          value: Number(rs.order.filled_avg_price),
        });
        state.orders.push(rs.order);
        state.isBuyInProgress = false;
      } else if (rs.order.side === 'sell') {
        const currentOrder = state.orders.find(o => o.id !== state.sellId);
        console.log(
          `${rs.order.symbol} sell order fulfilled for ${rs.order.filled_qty} at $${rs.order.filled_avg_price}`,
        );
        state.data.sells.push({
          date: rs.order.filled_at,
          profit:
            Number(rs.order.filled_qty) *
            (Number(rs.order.filled_avg_price) - Number(currentOrder.filled_avg_price)),
          qty: Number(rs.order.filled_qty),
          symbol: rs.order.symbol,
          value: Number(rs.order.filled_avg_price),
        });
        state.orders = state.orders.filter(o => o.id !== state.sellId);
        state.sellId = null;
      }
    }
  }
};

export default onOrderUpdate;

import moment from 'moment';
import storage from 'node-persist';
import state from './constants/state';
import config from './constants/config';
import client from './constants/client';
import alpaca from './constants/alpaca';
import onAccountUpdate from './eventHandlers/onAccountUpdate';
import onConnect from './eventHandlers/onConnect';
import onDisconnect from './eventHandlers/onDisconnect';
import onOrderUpdate from './eventHandlers/onOrderUpdate';
import onStateChange from './eventHandlers/onStateChange';
import onStockAggMin from './eventHandlers/onStockAggMin';
import onStockAggSec from './eventHandlers/onStockAggSec';
import onStockQuotes from './eventHandlers/onStockQuotes';
import onStockTrades from './eventHandlers/onStockTrades';
import processHistory from './utils/processHistory';
import analyzeData from './utils/analyzeData';

function marketOpen() {
  if (!state.clock.is_open) {
    state.app.status = 'CLOSED';
  }

  return state.clock.is_open;
}

const api = app => {
  function connectWebsocket() {
    client.onConnect(onConnect);
    client.onDisconnect(onDisconnect);
    client.onStateChange(onStateChange);
    client.onOrderUpdate(onOrderUpdate);
    client.onAccountUpdate(onAccountUpdate);
    client.onStockTrades(onStockTrades);
    client.onStockQuotes(onStockQuotes);
    client.onStockAggSec(onStockAggSec);
    client.onStockAggMin(onStockAggMin);

    client.connect();
  }

  function doHistoryLookup() {
    const promises = [
      alpaca
        .getBars('day', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('day', data)),

      alpaca
        .getBars('15Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('15min', data)),

      alpaca
        .getBars('5Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('5min', data)),

      alpaca
        .getBars('1Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('1min', data)),

      alpaca.getAccount().then(account => {
        state.account = account;
      }),

      alpaca.getClock().then(clock => {
        state.clock = clock;
      }),
    ];

    if (state.app.buyOrders) {
      state.app.buyOrders.forEach(({ id }) => {
        promises.push(
          alpaca
            .getOrder(id)
            .then(order => {
              if (order.status === 'filled') {
                // eslint-disable-next-line no-console
                console.log(
                  `${moment().format()}: ${order.symbol} buy order fulfilled for ${
                    order.filled_avg_price
                  }`,
                );
                state.app.positions.push(order);
                state.app.buys += 1;
                state.app.buyTotal += parseFloat(order.filled_avg_price * order.filled_qty);
                state.app.buyOrders = state.app.buyOrders.filter(item => item.id !== order.id);
              } else if (order.status === 'canceled') {
                state.app.buyOrders = state.app.buyOrders.filter(item => item.id !== order.id);
              }
            })
            .catch(() => {
              state.app.buyOrders = state.app.buyOrders.filter(item => item.id !== id);
            }),
        );
      });
    }

    if (state.app.sellOrders) {
      state.app.sellOrders.forEach(sellOrder => {
        promises.push(
          alpaca
            .getOrder(sellOrder.id)
            .then(order => {
              if (order.status === 'filled') {
                // eslint-disable-next-line no-console
                console.log(
                  `${moment().format()}: ${order.symbol} sell order fulfilled for ${
                    order.filled_avg_price
                  }`,
                );
                const amount = parseFloat(order.filled_avg_price) - parseFloat(sellOrder.cost);
                const date = moment().format('MM-DD-YYYY');
                state.app.sells += 1;
                state.app.sellTotal += parseFloat(order.filled_avg_price * order.filled_qty);
                state.app.profit += amount;
                if (!state.app.profitData) {
                  state.app.profitData = {};
                }
                if (!state.app.profitData[date]) {
                  state.app.profitData[date] = [];
                }
                state.app.profitData[date].push(amount);

                state.app.sellOrders = state.app.sellOrders.filter(item => item.id !== order.id);
              } else {
                state.app.positions.push(sellOrder);
                state.app.sellOrders = state.app.sellOrders.filter(item => item.id !== order.id);
              }
            })
            .catch(() => {
              state.app.positions.push(sellOrder);
              state.app.sellOrders = state.app.sellOrders.filter(item => item.id !== sellOrder.id);
            }),
        );
      });
    }

    if (marketOpen()) {
      state.app.status = 'RUNNING';
      Promise.all(promises)
        .then(() => {
          analyzeData();
          if (state.didTransaction) {
            // eslint-disable-next-line no-console
            console.log('');
            state.didTransaction = false;
          }
        })
        .catch(() => {});
    }

    setTimeout(doHistoryLookup, config.tick);
  }

  async function start() {
    await storage.init();
    const persistedApp = await storage.getItem('app');
    if (persistedApp) {
      state.app = persistedApp;
    }
    connectWebsocket();
    doHistoryLookup();
  }

  start();

  /* Endpoints */
  app.get('/update', (err, res) => {
    res.status(200);
    res.json(state);
    res.end();
  });
};

export default api;

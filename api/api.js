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
  const format = 'hh:mm:ss';
  const today = moment();
  const marketOpen = moment(config.startTime, format);
  const marketClose = moment(config.stopTime, format);

  if (!today.isBetween(marketOpen, marketClose)) {
    state.app.status = 'CLOSED';
  }

  if (today.weekday() === 0 || today.weekday() === 7) {
    state.app.status = 'WEEKEND';
  }

  return today.isBetween(marketOpen, marketClose) && today.weekday() !== 6 && today.weekday() !== 0;
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
    const currentDate = moment();
    const startTime = moment('09:30 am', 'HH:mm a');
    const endTime = moment('04:55 pm', 'HH:mm a');

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
    ];

    if (state.app.buyOrders) {
      state.app.buyOrders.forEach(({ id }) => {
        promises.push(
          alpaca.getOrder(id).then(order => {
            if (order.status === 'filled') {
              state.app.positions.push(order);
              state.app.buys += 1;
              state.app.buyTotal += parseFloat(order.filled_avg_price);
              state.app.buyOrders = state.app.buyOrders.filter(item => item.id !== order.id);
            } else if (order.status === 'canceled') {
              state.app.buyOrders = state.app.buyOrders.filter(item => item.id !== order.id);
            }
          }),
        );
      });
    }

    if (state.app.sellOrders) {
      state.app.sellOrders.forEach(sellOrder => {
        promises.push(
          alpaca.getOrder(sellOrder.id).then(order => {
            if (order.status === 'filled') {
              state.app.sells += 1;
              state.app.sellTotal += parseFloat(order.filled_avg_price);
              state.app.profit += parseFloat(order.filled_avg_price) - parseFloat(sellOrder.cost);

              state.app.sellOrders = state.app.sellOrders.filter(item => item.id !== order.id);
            } else if (order.status === 'canceled') {
              state.app.sellOrders = state.app.sellOrders.filter(item => item.id !== order.id);
            }
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
            console.log('');
            state.didTransaction = false;
          }
        })
        .catch(e => console.log(e));
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

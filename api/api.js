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
    state.status = 'CLOSED';
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
        .then(data => processHistory('day', data))
        .catch(() => {}),

      alpaca
        .getBars('15Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('15min', data))
        .catch(() => {}),

      alpaca
        .getBars('5Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('5min', data))
        .catch(() => {}),

      alpaca
        .getBars('1Min', config.ticker, {
          limit: 1,
        })
        .then(data => processHistory('1min', data))
        .catch(() => {}),

      alpaca
        .getAccount()
        .then(account => {
          state.account = account;
        })
        .catch(() => {}),

      alpaca
        .getClock()
        .then(clock => {
          state.clock = clock;
        })
        .catch(() => {}),
    ];

    if (marketOpen()) {
      state.status = 'RUNNING';
      Promise.all(promises)
        .then(() => {
          analyzeData();
        })
        .catch(() => {});
    }

    setTimeout(doHistoryLookup, config.tick);
  }

  async function start() {
    await storage.init();
    const persistedApp = await storage.getItem('app');
    if (persistedApp) {
      Object.assign(state, persistedApp);
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

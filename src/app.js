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
import updateStatus from './utils/updateStatus';
import analyzeData from './utils/analyzeData';

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
  const historyPromises = [
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
  ];

  Promise.all(historyPromises).then(() => {
    /*
    state.quotes = {
      [`Q.${config.ticker}`]: {
        bp: 230.75,
        ap: 206.75,
      },
    };
    */

    if (state.quotes[`Q.${config.ticker}`]) {
      analyzeData();
      updateStatus('Running...');
    }
  });

  setTimeout(doHistoryLookup, config.tick);
}

function start() {
  updateStatus('Starting bot...');
  connectWebsocket();
  doHistoryLookup();
}

start();

export default state;

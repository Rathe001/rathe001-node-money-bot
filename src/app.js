import Alpaca from '@alpacahq/alpaca-trade-api';
import { throttle } from 'lodash';
import { config } from 'constants/config';
import { creds } from 'constants/creds';

const alpaca = new Alpaca(creds);
const client = alpaca.websocket;

let state = {
  quotes: {},
};

const onConnect = () => {
  updateStatus('Connected');

  client.subscribe(['trade_updates', 'account_updates', 'T.FB', 'Q.AAPL', 'A.FB', 'AM.AAPL']);
};

const onDisconnect = () => updateStatus('Disconnected');

const onStateChange = newState => {};

const onOrderUpdate = data => updateStatus('Order update');

const onAccountUpdate = data => {};

const onStockTrades = (subject, data) => {};

const onStockQuotes = (subject, data) => {
  state.quotes = {
    ...state.quotes,
    [subject]: data,
  };

  updateStatus('Stock quotes');
};

const onStockAggSec = (subject, data) => {};

const onStockAggMin = (subject, data) => {};

function start() {
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

const updateStatus = throttle(status => {
  console.clear();
  Object.keys(state.quotes).forEach(key => {
    process.stdout.write(`${key}: ${JSON.stringify(state.quotes[key])}\n`);
  });
  process.stdout.write(`\n`);
  process.stdout.write(status);
}, config.throttleDelay);

start();

import client from '../constants/client';
import config from '../constants/config';

const onConnect = () => {
  client.subscribe(config.ticker.map(ticker => `Q.${ticker}`));
  // eslint-disable-next-line no-console
  console.log(`Websocket connected. Listening to ${config.ticker.map(ticker => `Q.${ticker}`)}`);
};

export default onConnect;

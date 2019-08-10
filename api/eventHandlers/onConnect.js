import client from '../constants/client';
import config from '../constants/config';

const onConnect = () => {
  client.subscribe(config.ticker.map(ticker => `Q.${ticker}`));
};

export default onConnect;

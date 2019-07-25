import updateStatus from '../utils/updateStatus';
import client from '../constants/client';
import config from '../constants/config';

const onConnect = () => {
  updateStatus('Connected, waiting for data...');

  client.subscribe(['trade_updates', 'account_updates', `Q.${config.ticker}`]);
};

export default onConnect;

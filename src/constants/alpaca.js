import Alpaca from '@alpacahq/alpaca-trade-api';
import creds from './creds';

const alpaca = new Alpaca(creds);

export default alpaca;

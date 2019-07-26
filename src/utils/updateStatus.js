import { throttle } from 'lodash';
import chalk from 'chalk';
import config from '../constants/config';
import state from '../constants/state';

const updateStatus = throttle(status => {
  console.clear();
  process.stdout.write(`Stock: ${config.ticker}\n`);
  process.stdout.write(`Status: ${status}\n\n`);

  if (state.quotes && state.quotes[`Q.${config.ticker}`]) {
    process.stdout.write(
      `Sell: $${
        state.quotes[`Q.${config.ticker}`].bp > state.history['1min'].o
          ? chalk.green(state.quotes[`Q.${config.ticker}`].bp)
          : chalk.red(state.quotes[`Q.${config.ticker}`].bp)
      }    Buy: $${
        state.quotes[`Q.${config.ticker}`].ap > state.history['1min'].o
          ? chalk.green(state.quotes[`Q.${config.ticker}`].ap)
          : chalk.red(state.quotes[`Q.${config.ticker}`].ap)
      }\n\n`,
    );
  }

  if (state.history && state.history['1min']) {
    process.stdout.write(
      ` 1 min:  $${
        state.history['1min'].o > state.history['5min'].o
          ? chalk.green(state.history['1min'].o)
          : chalk.red(state.history['1min'].o)
      }\n`,
    );
  }
  if (state.history && state.history['5min']) {
    process.stdout.write(
      ` 5 min:  $${
        state.history['5min'].o > state.history['15min'].o
          ? chalk.green(state.history['5min'].o)
          : chalk.red(state.history['5min'].o)
      }\n`,
    );
  }
  if (state.history && state.history['15min']) {
    process.stdout.write(
      `15 min:  $${
        state.history['15min'].o > state.history.day.o
          ? chalk.green(state.history['15min'].o)
          : chalk.red(state.history['15min'].o)
      }\n`,
    );
  }
  if (state.history && state.history['day']) {
    process.stdout.write(` 1 day:  $${chalk.red(state.history.day.o)}\n\n`);
  }

  process.stdout.write(`Last tick:  ${state.ui.updated}\n`);
  process.stdout.write(`Ticks:  ${state.ui.ticks}\n`);
  process.stdout.write(`Buys:  ${state.ui.buys} ($${state.ui.buyTotal})\n`);
  process.stdout.write(`Sells:  ${state.ui.sells} ($${state.ui.sellTotal})\n`);
  process.stdout.write(`Current:  ${state.ui.wallet.length}\n\n`);

  process.stdout.write(`Total:  $${state.ui.sellTotal - state.ui.buyTotal}\n`);
}, config.throttleDelay);

export default updateStatus;

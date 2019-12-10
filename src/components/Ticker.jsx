import React from 'react';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';

const useStyles = createUseStyles({
  down: {
    color: 'red',
  },
  label: {
    width: '30%',
  },
  price: {
    width: '70%',
  },
  sym: {
    fontSize: 16,
    margin: '0 0 5px 0',
    width: '100%',
  },
  ticker: {
    border: '1px solid black',
    boxShadow: '0 0 3px rgba(0, 0, 0, .3)',
    display: 'flex',
    flexWrap: 'wrap',
    margin: 5,
    padding: 5,
    width: 150,
  },
  up: {
    color: 'green',
  },
});

const Ticker = ({ quote, symbol }) => {
  const classes = useStyles();
  const percentDailyChange = ((1 - quote.current.ap / quote.day.o) * -100).toFixed(1);

  return (
    <div className={classes.ticker}>
      <span className={classes.sym}>
        {symbol} (
        <span
          className={classnames({
            [classes.up]: percentDailyChange > 0,
            [classes.down]: percentDailyChange < 0,
          })}
        >
          {percentDailyChange}%
        </span>
        )
      </span>
      <span className={classes.label}>Current: </span>
      <span
        className={classnames(classes.price, {
          [classes.up]: quote.current.bp > quote['1min'].o,
          [classes.down]: quote.current.bp < quote['1min'].o,
        })}
      >
        ${quote.current.bp.toLocaleString('en-US')}
      </span>
      <span className={classes.label}>1 min: </span>
      <span
        className={classnames(classes.price, {
          [classes.up]: quote['1min'].o > quote['5min'].o,
          [classes.down]: quote['1min'].o < quote['5min'].o,
        })}
      >
        ${quote['1min'].o.toLocaleString('en-US')}
      </span>
      <span className={classes.label}>5 min: </span>
      <span
        className={classnames(classes.price, {
          [classes.up]: quote['5min'].o > quote['15min'].o,
          [classes.down]: quote['5min'].o < quote['15min'].o,
        })}
      >
        ${quote['5min'].o.toLocaleString('en-US')}
      </span>
      <span className={classes.label}>15 min: </span>
      <span
        className={classnames(classes.price, {
          [classes.up]: quote['15min'].o > quote.day.o,
          [classes.down]: quote['15min'].o < quote.day.o,
        })}
      >
        ${quote['15min'].o.toLocaleString('en-US')}
      </span>
      <span className={classes.label}>Day: </span>
      <span className={classes.price}>
        ${quote.day.o.toLocaleString(
          'en-US',
          { currency: 'USD' },
        )}
      </span>
    </div>
  );
};

export default Ticker;

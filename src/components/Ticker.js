import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  ticker: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 150,
    border: '1px solid black',
    padding: 5,
    margin: 5,
    boxShadow: '0 0 3px rgba(0, 0, 0, .3)',
  },
  sym: {
    width: '100%',
    fontSize: 16,
    margin: '0 0 5px 0',
  },
  label: {
    width: '30%',
  },
  price: {
    width: '70%',
  },
});

const Ticker = ({ quote, history }) => {
  const classes = useStyles();

  return (
    <div className={classes.ticker}>
      <span className={classes.sym}>{quote.sym}</span>
      <span className={classes.label}>Current: </span>
      <span className={classes.price}>${quote.bp.toLocaleString('en-US')}</span>
      <span className={classes.label}>1 min: </span>
      <span className={classes.price}>${history['1min'].o.toLocaleString('en-US')}</span>
      <span className={classes.label}>5 min: </span>
      <span className={classes.price}>${history['5min'].o.toLocaleString('en-US')}</span>
      <span className={classes.label}>15 min: </span>
      <span className={classes.price}>${history['15min'].o.toLocaleString('en-US')}</span>
      <span className={classes.label}>Day: </span>
      <span className={classes.price}>
        ${history['day'].o.toLocaleString('en-US', { currency: 'USD' })}
      </span>
    </div>
  );
};

export default Ticker;

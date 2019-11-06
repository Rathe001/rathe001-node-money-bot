import React from 'react';
import { createUseStyles } from 'react-jss';
import moment from 'moment';
import classnames from 'classnames';

const useStyles = createUseStyles({
  position: {
    boxSizing: 'border-box',
    position: 'relative',
    width: '10%',
    margin: [0, -1, -1, 0],
    border: '1px solid black',
    padding: 5,
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',

    '& p': {
      padding: '0 0 10px 0',
      margin: 0,
    },
  },
  symbol: {
    fontWeight: 700,
  },
  datePrice: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  daysOld: {},
  profit: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  new: {
    opacity: 0.3,
  },
  up: {
    color: 'green',
  },
  down: {
    color: 'red',
  },
});

const Position = ({ data, quote }) => {
  const classes = useStyles();
  const daysOld = moment().diff(moment(data.filled_at), 'days');
  const profit = Number(quote) * data.filled_qty - Number(data.filled_avg_price) * data.filled_qty;
  return (
    <div
      className={classnames(classes.position, {
        [classes.new]: daysOld === 0,
      })}
    >
      <p className={classes.symbol}>
        {data.symbol} ({data.filled_qty})
      </p>
      <p
        className={classnames(classes.profit, {
          [classes.up]: profit > 0,
          [classes.down]: profit < 0,
        })}
      >
        ${quote === 0 ? '???' : profit.toFixed(2)}
      </p>
      <p className={classes.daysOld}>
        {daysOld} {daysOld === 1 ? 'day' : 'days'} old
      </p>
      <p className={classes.datePrice}>
        ${data.filled_avg_price} at {moment(data.filled_at).format('h:mma')}
      </p>
    </div>
  );
};

export default Position;

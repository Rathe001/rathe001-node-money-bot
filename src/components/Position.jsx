import React from 'react';
import { createUseStyles } from 'react-jss';
import moment from 'moment';
import classnames from 'classnames';

const useStyles = createUseStyles({
  datePrice: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  daysOld: {},
  down: {
    color: 'red',
  },
  new: {
    opacity: 0.3,
  },
  position: {
    '& p': {
      margin: 0,
      padding: '0 0 10px 0',
    },
    border: '1px solid black',
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box',
    margin: [0, -1, -1, 0],
    padding: 5,
    position: 'relative',

    width: '10%',
  },
  profit: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  symbol: {
    fontWeight: 700,
  },
  up: {
    color: 'green',
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

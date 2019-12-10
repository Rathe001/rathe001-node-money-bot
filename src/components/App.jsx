import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import classnames from 'classnames';

import appActions from 'core/actions';

import Ticker from 'components/Ticker';
import Position from 'components/Position';
import ProfitsChart from 'components/ProfitsChart';

const useStyles = createUseStyles({
  '@global': {
    body: {
      fontFamily: 'arial,sans-serif',
      fontSize: 12,
    },
  },
  app: {},
  closed: {
    color: 'yellow',
  },
  dataWrap: {
    display: 'flex',
  },
  flexGrid: {
    '& > div': {
      display: 'flex',
    },
    display: 'flex',
    flexDirection: 'column',
    width: 400,
  },
  flexWrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  h1: {
    textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
  },
  label: {
    fontWeight: 700,
    textAlign: 'right',
    width: 150,
  },
  running: {
    color: 'green',
  },
  status: {
    display: 'inline',
  },
  value: {
    padding: [0, 0, 0, 10],
  },
  weekend: {
    color: 'red',
  },
});

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const reduxApp = useSelector(state => state);

  const positionsTotal = reduxApp.orders.reduce(
    (total, item) =>
      total +
      (reduxApp.quotes.current[item.symbol]
        ? parseFloat(reduxApp.quotes.current[item.symbol].bp * item.filled_qty)
        : 0),
    0,
  );

  async function doUpdate() {
    const rs = await axios.get('/update');

    dispatch(appActions.setData(rs.data));

    setTimeout(doUpdate, 1000);
  }

  function startApp() {
    doUpdate();
  }

  useEffect(() => {
    startApp();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.app}>
      <h1 className={classes.h1}>
        Node Money Bot is{' '}
        <span
          className={classnames(classes.status, {
            [classes.running]: reduxApp.status === 'RUNNING',
            [classes.closed]: reduxApp.status === 'CLOSED',
          })}
        >
          {reduxApp.status === 'RUNNING' ? 'running!' : ''}
          {reduxApp.status === 'CLOSED' ? 'waiting for markets to open...' : ''}
        </span>
      </h1>
      <div className={classes.dataWrap}>
        <div className={classes.flexGrid}>
          <div>
            <div className={classes.label}>Ticks:</div>
            <div className={classes.value}>{reduxApp.ticks}</div>
          </div>
          <div>
            <div className={classes.label}>Buys:</div>
            <div className={classes.value}>
              {reduxApp.data.buys.length} ($
              {reduxApp.data.buys
                .reduce((acc, item) => acc + item.value, 0)
                .toLocaleString('en-US')}
              )
            </div>
          </div>
          <div>
            <div className={classes.label}>Sells:</div>
            <div className={classes.value}>
              {reduxApp.data.sells.length} ($
              {reduxApp.data.sells
                .reduce((acc, item) => acc + item.value, 0)
                .toLocaleString('en-US')}
              )
            </div>
          </div>
          <div>
            <div className={classes.label}>Cash:</div>
            <div className={classes.value}>
              ${parseFloat(reduxApp.account.cash).toLocaleString('en-US')}
            </div>
          </div>
          <div>
            <div className={classes.label}>Pattern day trader?</div>
            <div className={classes.value}>
              {reduxApp.account.pattern_day_trader ? 'YES' : 'NO'}
            </div>
          </div>
          <div>
            <div className={classes.label}>Profit:</div>
            <div className={classes.value}>
              $
              {reduxApp.data.sells
                .reduce((acc, item) => acc + item.profit, 0)
                .toLocaleString('en-US')}
            </div>
          </div>
          <div>
            <div className={classes.label}>Current value:</div>
            <div className={classes.value}>
              ${(positionsTotal + Number(reduxApp.account.cash)).toLocaleString('en-US')}
            </div>
          </div>
        </div>

        <ProfitsChart profits={reduxApp.data.sells} />
      </div>

      <h2>{reduxApp.orders.length} Positions:</h2>
      <div className={classes.flexWrap}>
        {reduxApp.orders
          .sort((a, b) => a.symbol.localeCompare(b.symbol))
          .map(position => (
            <Position
              key={position.id}
              data={position}
              quote={
                reduxApp.quotes.current[position.symbol]
                  ? reduxApp.quotes.current[position.symbol].bp
                  : 0
              }
            />
          ))}
      </div>

      <h2>Prices:</h2>
      <div className={classes.flexWrap}>
        {Object.keys(reduxApp.quotes.current)
          .sort((a, b) => a.localeCompare(b))
          .map(quote => (
            <Ticker
              key={quote}
              symbol={quote}
              quote={{
                '15min': reduxApp.quotes['15min'][quote],
                '1min': reduxApp.quotes['1min'][quote],
                '5min': reduxApp.quotes['5min'][quote],
                current: reduxApp.quotes.current[quote],
                day: reduxApp.quotes.day[quote],
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default App;

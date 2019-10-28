import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import classnames from 'classnames';

import appActions from 'core/app/actions';
import historyActions from 'core/history/actions';
import quotesActions from 'core/quotes/actions';
import accountActions from 'core/account/actions';

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
  flexWrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexGrid: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    '& > div': {
      display: 'flex',
    },
  },
  label: {
    textAlign: 'right',
    fontWeight: 700,
    width: 150,
  },
  value: {
    padding: [0, 0, 0, 10],
  },
  h1: {
    textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
  },
  status: {
    display: 'inline',
  },
  running: {
    color: 'green',
  },
  closed: {
    color: 'yellow',
  },
  weekend: {
    color: 'red',
  },
  dataWrap: {
    display: 'flex',
  }
});

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const reduxApp = useSelector(state => state.app);
  const reduxHistory = useSelector(state => state.history);
  const reduxQuotes = useSelector(state => state.quotes);
  const reduxAccount = useSelector(state => state.account);

  const positionsTotal = reduxApp.positions.reduce(
    (total, item) => total + parseFloat(item.filled_avg_price),
    0,
  );

  async function doUpdate() {
    const rs = await axios.get('/update');

    dispatch(appActions.setData(rs.data.app));
    dispatch(historyActions.setData(rs.data.history));
    dispatch(quotesActions.setData(rs.data.quotes));
    dispatch(accountActions.setData(rs.data.account));

    setTimeout(doUpdate, 5000);
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
              {reduxApp.buys} (${reduxApp.buyTotal.toLocaleString('en-US')})
            </div>
          </div>
          <div>
            <div className={classes.label}>Sells:</div>
            <div className={classes.value}>
              {reduxApp.sells} (${reduxApp.sellTotal.toLocaleString('en-US')})
            </div>
          </div>
          <div>
            <div className={classes.label}>Cash:</div>
            <div className={classes.value}>
              ${parseFloat(reduxAccount.cash).toLocaleString('en-US')}
            </div>
          </div>
          <div>
            <div className={classes.label}>Pattern day trader?</div>
            <div className={classes.value}>{reduxAccount.pattern_day_trader ? 'YES' : 'NO'}</div>
          </div>
          <div>
            <div className={classes.label}>Profit:</div>
            <div className={classes.value}>${reduxApp.profit.toLocaleString('en-US')}</div>
          </div>
          <div>
            <div className={classes.label}>Current value:</div>
            <div className={classes.value}>${positionsTotal.toLocaleString('en-US')}</div>
          </div>
          <div>
            <div className={classes.label}>Open buy orders:</div>
            <div className={classes.value}>{reduxApp.buyOrders.length}</div>
          </div>
          <div>
            <div className={classes.label}>Open sell orders:</div>
            <div className={classes.value}>{reduxApp.sellOrders.length}</div>
          </div>
        </div>

        <ProfitsChart profits={reduxApp.profitData} />
      </div>
      <h2>{reduxApp.positions.length} Positions:</h2>
      <div className={classes.flexWrap}>
        {reduxApp.positions
          .sort((a, b) => a.symbol.localeCompare(b.symbol))
          .map(position => (
            <Position
              key={position.id}
              data={position}
              quote={reduxQuotes[position.symbol] ? reduxQuotes[position.symbol].bp : 0}
            />
          ))}
      </div>
      <h2>Prices:</h2>
      <div className={classes.flexWrap}>
        {Object.keys(reduxQuotes)
          .sort((a, b) => a.localeCompare(b))
          .map(quote => (
            <Ticker
              key={quote}
              quote={reduxQuotes[quote]}
              history={{
                '1min': reduxHistory['1min'][quote][0],
                '5min': reduxHistory['5min'][quote][0],
                '15min': reduxHistory['15min'][quote][0],
                day: reduxHistory['day'][quote][0],
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default App;

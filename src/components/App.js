import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import classnames from 'classnames';

import appActions from 'core/app/actions';
import historyActions from 'core/history/actions';
import quotesActions from 'core/quotes/actions';

import Ticker from 'components/Ticker';
import Position from 'components/Position';

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
  status: {
    background: 'black',
    padding: 5,
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
});

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const reduxApp = useSelector(state => state.app);
  const reduxHistory = useSelector(state => state.history);
  const reduxQuotes = useSelector(state => state.quotes);

  async function doUpdate() {
    const rs = await axios.get('/update');

    dispatch(appActions.setData(rs.data.app));
    dispatch(historyActions.setData(rs.data.history));
    dispatch(quotesActions.setData(rs.data.quotes));

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
      <h1>Node Money Bot</h1>
      <p
        className={classnames(classes.status, {
          [classes.running]: reduxApp.status === 'RUNNING',
          [classes.weekend]: reduxApp.status === 'WEEKEND',
          [classes.closed]: reduxApp.status === 'CLOSED',
        })}
      >
        {`${reduxApp.status === 'RUNNING' ? 'Running...' : ''}
        ${reduxApp.status === 'CLOSED' ? 'Waiting for markets to open...' : ''}
        ${reduxApp.status === 'WEEKEND' ? 'Markets closed on weekends...' : ''}`}
      </p>
      <p>Ticks: {reduxApp.ticks}</p>
      <p>
        Buys: {reduxApp.buys} (${reduxApp.buyTotal.toLocaleString('en-US')})
      </p>
      <p>
        Sells: {reduxApp.sells} (${reduxApp.sellTotal.toLocaleString('en-US')})
      </p>
      <p>Profit: ${reduxApp.profit.toLocaleString('en-US')}</p>
      <h2>Positions ({reduxApp.positions.length}):</h2>
      <div className={classes.flexWrap}>
        {reduxApp.positions.map(position => (
          <Position key={position.uuid} data={position} />
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

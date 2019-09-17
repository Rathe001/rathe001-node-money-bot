import { combineReducers } from 'redux';
import app from 'core/app/reducers';
import history from 'core/history/reducers';
import quotes from 'core/quotes/reducers';
import account from 'core/account/reducers';

const appReducer = combineReducers({
  app,
  history,
  quotes,
  account,
});

export default (state, action) => appReducer(state, action);

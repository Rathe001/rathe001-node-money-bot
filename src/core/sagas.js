import { all } from 'redux-saga/effects';
import appSagas from 'core/app/sagas';
import historySagas from 'core/history/sagas';
import quotesSagas from 'core/quotes/sagas';
import accountSagas from 'core/account/sagas';

const combinedSagas = [...appSagas, ...historySagas, ...quotesSagas, ...accountSagas];

export default function* sagas() {
  yield all(combinedSagas);
}

import { all } from 'redux-saga/effects';
import appSagas from 'core/app/sagas';
import historySagas from 'core/history/sagas';
import quotesSagas from 'core/quotes/sagas';

const combinedSagas = [...appSagas, ...historySagas, ...quotesSagas];

export default function* sagas() {
  yield all(combinedSagas);
}

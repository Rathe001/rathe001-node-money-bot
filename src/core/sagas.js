import { all } from 'redux-saga/effects';

const appSagas = [];
const combinedSagas = [...appSagas];

export default function* sagas() {
  yield all(combinedSagas);
}

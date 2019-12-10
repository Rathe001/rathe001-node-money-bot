import actions from './actions';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_DATA:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

export default (state, action) => reducer(state, action);

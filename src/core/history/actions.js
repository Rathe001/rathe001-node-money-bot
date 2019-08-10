const actions = {
  SET_DATA: 'HISTORY_SET_DATA',
  setData: data => ({
    type: actions.SET_DATA,
    payload: data,
  }),
};

export default actions;

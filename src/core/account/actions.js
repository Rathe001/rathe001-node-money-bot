const actions = {
  SET_DATA: 'ACCOUNT_SET_DATA',
  setData: data => ({
    type: actions.SET_DATA,
    payload: data,
  }),
};

export default actions;

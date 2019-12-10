const actions = {
  SET_DATA: 'APP_SET_DATA',
  setData: data => ({
    payload: data,
    type: actions.SET_DATA,
  }),
};

export default actions;

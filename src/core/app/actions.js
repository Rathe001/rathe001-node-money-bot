const actions = {
  SET_DATA: 'APP_SET_DATA',
  setData: data => ({
    type: actions.SET_DATA,
    payload: data,
  }),
};

export default actions;

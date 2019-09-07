import React from 'react';
import { createUseStyles } from 'react-jss';
import moment from 'moment';

const useStyles = createUseStyles({
  position: {
    width: 100,
    border: '1px solid black',
    padding: 5,
    margin: 5,
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',

    '& p': {
      padding: '0 0 10px 0',
      margin: 0,
    },
  },
});

const Position = ({ data }) => {
  const classes = useStyles();
  let daysOld = moment().diff(moment(data.date), 'days');

  return (
    <div className={classes.position}>
      <p>{data.sym}</p>
      <p>${data.cost.toLocaleString('en-US')}</p>
      <p>{moment(data.date).format('MM/DD/YYYY h:mm:ss a')}</p>
    </div>
  );
};

export default Position;

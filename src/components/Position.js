import React from 'react';
import { createUseStyles } from 'react-jss';

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

  return (
    <div className={classes.position}>
      <p>{data.sym}</p>
      <p>${data.cost.toLocaleString('en-US')}</p>
      <p>{data.date}</p>
    </div>
  );
};

export default Position;

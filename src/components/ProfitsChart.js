import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { Chart } from 'react-charts';
import moment from 'moment';

const useStyles = createUseStyles({
  chart: {
    height: 150,
    width: '100%',
    boxSizing: 'border-box',
    margin: [25, 0],
  },
});

const ProfitsChart = ({ profits = {} }) => {
  const classes = useStyles();
  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    [],
  );
  const chartData = useMemo(
    () => [
      {
        label: 'Profits',
        data: Object.keys(profits).map(date => [
          moment(date),
          profits[date].reduce((total, item) => total + item, 0),
        ]),
        secondaryAxisID: 'Profits',
      },
      {
        label: 'Number of sales',
        data: Object.keys(profits).map(date => [moment(date), profits[date].length]),
        secondaryAxisID: 'Sales',
      },
    ],
    [profits],
  );

  const axes = useMemo(
    () => [
      { primary: true, type: 'time', id: 'Time', position: 'bottom', show: true },
      { type: 'linear', position: 'left', id: 'Profits', show: true },
      {
        type: 'linear',
        id: 'Sales',
        min: 0,
        position: 'right',
      },
    ],
    [],
  );
  return (
    <div className={classes.chart}>
      <Chart
        data={chartData}
        axes={axes}
        series={series}
        focus="auto"
        primaryCursor
        secondaryCursor
      />
    </div>
  );
};

export default ProfitsChart;

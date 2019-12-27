import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flex: '1 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="body1">This page does not exist</Typography>
    </div>
  );
}

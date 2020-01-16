import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useConfig } from '../config';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: '0 0 auto',
  },
});

export default function StandardTemplate({ children }: Props) {
  const classes = useStyles();
  const config = useConfig();

  return (
    <div className={classes.root}>
      <Header config={config} className={classes.header} />
      {children}
    </div>
  );
}

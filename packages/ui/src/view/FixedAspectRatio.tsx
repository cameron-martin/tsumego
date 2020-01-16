import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

interface Props {
  aspectRatio: number;
  children: React.ReactNode;
}

const useStyles = makeStyles<Theme, Props>({
  root: props => ({
    paddingBottom: `${props.aspectRatio * 100}%`,
    height: 0,
    width: '100%',
    position: 'relative',
  }),

  inner: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default function FixedAspectRatio(props: Props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.inner}>{props.children}</div>
    </div>
  );
}

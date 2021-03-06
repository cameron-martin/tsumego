import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  lastPlaced?: boolean;
  isShadow?: boolean;
  player: 'black' | 'white';
}

const flipPlayer = {
  black: 'white',
  white: 'black',
} as const;

const colours = (theme: Theme) =>
  ({
    black: theme.palette.grey[900],
    white: theme.palette.grey[50],
  } as const);

const useStyles = makeStyles<Theme, Props>((theme) => ({
  root: (props) => ({
    borderRadius: '100%',
    position: 'absolute',
    top: '3%',
    right: '3%',
    bottom: '3%',
    left: '3%',
    zIndex: 1,
    opacity: props.isShadow ? 0.5 : 1,
    backgroundColor: colours(theme)[props.player],
  }),
  lastPlaced: (props) => ({
    '&::before': {
      content: '" "',
      position: 'absolute',
      borderRadius: '100%',
      top: '32%',
      left: '32%',
      bottom: '32%',
      right: '32%',
      border: `2px solid ${colours(theme)[flipPlayer[props.player]]}`,
    },
  }),
}));

export default function Stone(props: Props) {
  const classes = useStyles(props);

  return (
    <div
      className={clsx(classes.root, props.lastPlaced && classes.lastPlaced)}
      data-stone-shadow={props.isShadow}
    />
  );
}

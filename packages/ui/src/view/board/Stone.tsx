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

const useStyles = makeStyles<Theme, Props>(theme => ({
  root: props => ({
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
  lastPlaced: props => ({
    '&::before, &::after': {
      content: '" "',
      position: 'absolute',
      borderRadius: '100%',
    },
    // Outer ring
    '&::before': {
      top: '30%',
      left: '30%',
      bottom: '30%',
      right: '30%',
      backgroundColor: colours(theme)[flipPlayer[props.player]],
    },
    // Inner ring
    '&::after': {
      top: '35%',
      left: '35%',
      bottom: '35%',
      right: '35%',
      backgroundColor: colours(theme)[props.player],
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

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  lastPlaced?: boolean;
  isShadow?: boolean;
  colour: 'black' | 'white';
}

const flipColour = {
  black: 'white',
  white: 'black',
} as const;

const useStyles = makeStyles<Theme, Props>({
  root: props => ({
    borderRadius: '100%',
    position: 'absolute',
    top: '5%',
    right: '5%',
    bottom: '5%',
    left: '5%',
    zIndex: 1,
    opacity: props.isShadow ? 0.5 : 1,
    backgroundColor: props.colour,
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
      backgroundColor: flipColour[props.colour],
    },
    // Inner ring
    '&::after': {
      top: '35%',
      left: '35%',
      bottom: '35%',
      right: '35%',
      backgroundColor: props.colour,
    },
  }),
});

export default function Stone(props: Props) {
  const classes = useStyles(props);

  return (
    <div
      className={clsx(classes.root, props.lastPlaced && classes.lastPlaced)}
      data-stone-shadow={props.isShadow}
    />
  );
}

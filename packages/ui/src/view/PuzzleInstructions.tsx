import React from 'react';
import { GoPlayer } from '../model/GoGame';
import { Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  className?: string;
  humanPlayer: GoPlayer;
  state: 'in-progress' | 'correct' | 'wrong';
  onNextPuzzle(): void;
}

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    // TODO: Convert to use spacing
    height: '2rem',
  },
});

export default function PuzzleInstructions({
  className,
  onNextPuzzle,
  state,
  humanPlayer,
}: Props) {
  const classes = useStyles();

  if (state === 'in-progress') {
    return (
      <p className={clsx(classes.root, className)}>
        {humanPlayer === 'black' ? 'Black' : 'White'} to play
      </p>
    );
  }

  return (
    <p className={clsx(classes.root, className)}>
      {state === 'correct' ? 'Correct!' : 'Wrong!'}{' '}
      <Button variant="contained" color="primary" onClick={onNextPuzzle}>
        Next
      </Button>
    </p>
  );
}

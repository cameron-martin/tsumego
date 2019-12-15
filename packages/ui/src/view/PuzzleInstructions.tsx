import React from 'react';
import { GoPlayer } from '../model/GoGame';
import { classes, style } from './PuzzleInstructions.st.css';
import { Button } from '@material-ui/core';

interface Props {
  className?: string;
  humanPlayer: GoPlayer;
  state: 'in-progress' | 'correct' | 'wrong';
  onNextPuzzle(): void;
}

export default function PuzzleInstructions(props: Props) {
  if (props.state === 'in-progress') {
    return (
      <p className={style(classes.root, props.className)}>
        {props.humanPlayer === 'black' ? 'Black' : 'White'} to play
      </p>
    );
  }

  return (
    <p className={style(classes.root, props.className)}>
      {props.state === 'correct' ? 'Correct!' : 'Wrong!'}{' '}
      <Button variant="contained" color="primary" onClick={props.onNextPuzzle}>
        Next
      </Button>
    </p>
  );
}

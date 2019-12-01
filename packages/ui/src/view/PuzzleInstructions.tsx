import React from 'react';
import { GoPlayer } from '../model/GoGame';
import { classes, style } from './PuzzleInstructions.st.css';

interface Props {
  className?: string;
  humanPlayer: GoPlayer;
  state: 'in-progress' | 'correct' | 'wrong';
}

const handleNextClick = () => {
  window.location.reload();
};

export default function PuzzleInstructions(props: Props) {
  if (props.state === 'in-progress') {
    return (
      <div className={style(classes.root, props.className)}>
        {props.humanPlayer === 'black' ? 'Black' : 'White'} to play
      </div>
    );
  }

  return (
    <div className={style(classes.root, props.className)}>
      {props.state === 'correct' ? 'Correct!' : 'Wrong!'}{' '}
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
}

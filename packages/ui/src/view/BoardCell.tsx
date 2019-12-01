import { CellState, GoPlayer } from '../model/GoGame';
import React from 'react';
import { classes, style } from './BoardCell.st.css';

interface Props {
  state: CellState;
  /**
   * null represents that no player can play
   */
  currentPlayer: GoPlayer | null;
  row: number;
  column: number;
  onClick(row: number, column: number): void;
  className?: string;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

const getStone = (props: Props) => {
  if (props.state !== 'empty') {
    return <div className={style(classes.stone, { colour: props.state })} />;
  }

  if (props.currentPlayer != null) {
    return (
      <div
        className={style(classes.stone, {
          colour: props.currentPlayer,
          isShadow: true,
        })}
      />
    );
  }
};

export default React.memo(function BoardCell(props: Props) {
  const { top, bottom, left, right } = props;

  return (
    <div
      className={style(
        classes.root,
        { top, bottom, left, right },
        props.className,
      )}
      onClick={() => props.onClick(props.row, props.column)}
    >
      {getStone(props)}
    </div>
  );
});

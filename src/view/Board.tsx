import React, { useCallback } from 'react';
import { GoGame, GoMove, BoardPosition } from '../model/GoGame';
import { style, classes } from './Board.st.css';
import BoardCell from './BoardCell';
import FixedAspectRatio from './FixedAspectRatio';

interface Props {
  className?: string;
  game: GoGame;
  playMove(position: BoardPosition): void;
}

export default function Board({ className, game, playMove }: Props) {
  const rowsAndCols = [...Array(game.boardSize).keys()];

  const onCellClick = useCallback(
    (row: number, column: number) => {
      playMove([row, column]);
    },
    [playMove],
  );

  return (
    <div className={style(classes.root, className)}>
      <FixedAspectRatio aspectRatio={1}>
        <div className={classes.columns}>
          {rowsAndCols.map(i => (
            <div className={classes.column} key={i}>
              {rowsAndCols.map(j => (
                <BoardCell
                  className={classes.cell}
                  key={j}
                  row={i}
                  column={j}
                  state={game.getCell([i, j])}
                  onClick={onCellClick}
                  top={j === 0}
                  bottom={j === game.boardSize - 1}
                  left={i === 0}
                  right={i === game.boardSize - 1}
                />
              ))}
            </div>
          ))}
        </div>
      </FixedAspectRatio>
    </div>
  );
}

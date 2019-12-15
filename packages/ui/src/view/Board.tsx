import React, { useCallback } from 'react';
import { range } from 'lodash';
import { GoGame, BoardPosition } from '../model/GoGame';
import { style, classes } from './Board.st.css';
import BoardCell from './BoardCell';
import FixedAspectRatio from './FixedAspectRatio';

export interface BoardCrop {
  min: BoardPosition;
  max: BoardPosition;
}

interface Props {
  className?: string;
  game: GoGame;
  playMove(position: BoardPosition): void;
  crop?: BoardCrop;
}

const getRange = (crop: BoardCrop | undefined, game: GoGame, index: 0 | 1) => {
  return range(
    Math.max(0, crop ? crop.min[index] : -Infinity),
    Math.min(game.boardSize, crop ? crop.max[index] + 1 : Infinity),
  );
};

export default function Board({ className, game, playMove, crop }: Props) {
  const columns = getRange(crop, game, 0);
  const rows = getRange(crop, game, 1);

  const onCellClick = useCallback(
    (row: number, column: number) => {
      playMove([row, column]);
    },
    [playMove],
  );

  return (
    <div className={style(classes.root, className)}>
      <FixedAspectRatio aspectRatio={rows.length / columns.length}>
        <div className={classes.columns}>
          {columns.map(i => (
            <div className={classes.column} key={i}>
              {rows.map(j => (
                <BoardCell
                  currentPlayer={game.currentPlayer}
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

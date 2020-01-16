import React, { useCallback } from 'react';
import { range } from 'lodash';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { GoGame, BoardPosition } from '../../model/GoGame';
import BoardCell from './BoardCell';
import FixedAspectRatio from '../FixedAspectRatio';

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

const useStyles = makeStyles({
  root: {
    backgroundColor: '#deb887',
  },
  columns: {
    display: 'flex',
    height: '100%',
  },
  column: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  },
  cell: {
    flex: '1 1 0',
  },
});

const getRange = (crop: BoardCrop | undefined, game: GoGame, index: 0 | 1) => {
  return range(
    Math.max(0, crop ? crop.min[index] : -Infinity),
    Math.min(game.boardSize, crop ? crop.max[index] + 1 : Infinity),
  );
};

export default function Board({ className, game, playMove, crop }: Props) {
  const classes = useStyles();

  const columns = getRange(crop, game, 0);
  const rows = getRange(crop, game, 1);

  const onCellClick = useCallback(
    (row: number, column: number) => {
      playMove([row, column]);
    },
    [playMove],
  );

  return (
    <div className={clsx(classes.root, className)}>
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
                  lastPlaced={
                    game.lastPlacedStone
                      ? game.lastPlacedStone[0] === i &&
                        game.lastPlacedStone[1] === j
                      : false
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </FixedAspectRatio>
    </div>
  );
}

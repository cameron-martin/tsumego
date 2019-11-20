import React, { useCallback } from 'react';
import { GoGame, GoMove } from '../model/GoGame';
import { style, classes } from './Board.st.css';
import BoardCell from './BoardCell';
import FixedAspectRatio from './FixedAspectRatio';

interface Props {
  className?: string;
  game: GoGame;
  playMove(move: (game: GoGame) => GoMove): void;
}

export default function Board(props: Props) {
  const rowsAndCols = [...Array(props.game.boardSize).keys()];

  const onCellClick = useCallback(
    (row: number, column: number) => {
      props.playMove(game => ({
        position: [row, column],
        player: game.currentPlayer,
      }));
    },
    [props.playMove],
  );

  return (
    <div className={style(classes.root, props.className)}>
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
                  state={props.game.getCell([i, j])}
                  onClick={onCellClick}
                  top={j === 0}
                  bottom={j === props.game.boardSize - 1}
                  left={i === 0}
                  right={i === props.game.boardSize - 1}
                />
              ))}
            </div>
          ))}
        </div>
      </FixedAspectRatio>
    </div>
  );
}

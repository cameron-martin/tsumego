import React, { useCallback } from 'react';
import { GoGame } from '../model/GoGame';
import { style, classes } from './Board.st.css';
import BoardCell from './BoardCell';
import FixedAspectRatio from './FixedAspectRatio';

interface Props {
  className?: string;
  game: GoGame;
  setGame: React.Dispatch<React.SetStateAction<GoGame>>;
}

export default function Board(props: Props) {
  const rowsAndCols = [...Array(props.game.boardSize).keys()];

  const onCellClick = useCallback(
    (row: number, column: number) => {
      props.setGame(game => {
        const move = {
          position: [row, column],
          player: game.currentPlayer,
        } as const;

        return game.validateMove(move) == null ? game.playMove(move) : game;
      });
    },
    [props.setGame],
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
                  state={props.game.getCell(i, j)}
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

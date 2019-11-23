import Board from './Board';
import React, { useState, useCallback } from 'react';
import { GoGame, GoMove } from '../model/GoGame';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

export default function App() {
  const [game, setGame] = useState(GoGame.create(9));

  const playMove = useCallback(
    (getMove: (game: GoGame) => GoMove) => {
      setGame(game =>
        pipe(
          game.playMove(getMove(game)),
          either.fold(() => game, game => game),
        ),
      );
    },
    [setGame],
  );

  return <Board game={game} playMove={playMove} />;
}

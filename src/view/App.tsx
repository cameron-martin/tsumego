import Board from './Board';
import React, { useState, useCallback } from 'react';
import { GoGame, GoMove } from '../model/GoGame';

export default function App() {
  const [game, setGame] = useState(GoGame.create(9));

  const playMove = useCallback(
    (getMove: (game: GoGame) => GoMove) => {
      setGame(game => {
        const move = getMove(game);
        return game.validateMove(move) == null ? game.playMove(move) : game;
      });
    },
    [setGame],
  );

  return <Board game={game} playMove={playMove} />;
}

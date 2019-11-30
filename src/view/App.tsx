import Board from './Board';
import React, { useState, useCallback, useEffect } from 'react';
import { GoGame, GoMove, BoardPosition } from '../model/GoGame';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { ApiClient } from '../api-client';

type GameState =
  | Readonly<{
      loadState: 'LOADING';
    }>
  | Readonly<{
      loadState: 'LOADED';
      moveState: 'RESPONDING' | 'WAITING' | 'CORRECT' | 'WRONG';
      sequence: readonly BoardPosition[];
      id: string;
      game: GoGame;
    }>;

const apiClient = new ApiClient('http://localhost:8080');

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    loadState: 'LOADING',
  });

  useEffect(() => {
    apiClient.puzzle.getRandom().then(({ id, initialStones }) => {
      setGameState({
        loadState: 'LOADED',
        moveState: 'WAITING',
        id,
        sequence: [],
        game: GoGame.create(19, {
          white: initialStones.computer,
          black: initialStones.you,
        }),
      });
    });
  }, []);

  useEffect(() => {
    if (
      gameState.loadState === 'LOADED' &&
      gameState.moveState === 'RESPONDING'
    ) {
      apiClient.puzzle
        .solve(gameState.id, gameState.sequence)
        .then(response => {
          if (response.type === 'continue') {
            setGameState({
              ...gameState,
              moveState: 'WAITING',
              game: gameState.game.playValidMove({
                player: 'white',
                position: response.response,
              }),
            });
          } else if (response.type === 'correct') {
            setGameState({ ...gameState, moveState: 'CORRECT' });
          } else if (response.type === 'wrong') {
            setGameState({ ...gameState, moveState: 'WRONG' });
          }
        });
    }
  }, [gameState]);

  const playMove = useCallback((position: BoardPosition) => {
    setGameState(gameState => {
      if (
        gameState.loadState === 'LOADED' &&
        gameState.moveState === 'WAITING'
      ) {
        const newGame = gameState.game.playMove({ player: 'black', position });

        if (either.isLeft(newGame)) {
          return gameState;
        }

        return {
          ...gameState,
          sequence: gameState.sequence.concat([position]),
          game: newGame.right,
          moveState: 'RESPONDING',
        };
      } else {
        return gameState;
      }
    });
  }, []);

  if (gameState.loadState === 'LOADING') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        {(gameState.moveState === 'CORRECT' ||
          gameState.moveState === 'WRONG') &&
          gameState.moveState}
      </p>
      <Board game={gameState.game} playMove={playMove} />
    </div>
  );
}

import Board, { BoardCrop } from './Board';
import React, { useState, useCallback, useEffect } from 'react';
import { GoGame, BoardPosition } from '../model/GoGame';
import { either } from 'fp-ts';
import { ApiClient } from '@tsumego/api-client';
import PuzzleInstructions from './PuzzleInstructions';

interface Props {
  apiClient: ApiClient;
}

type GameState =
  | Readonly<{
      loadState: 'loading';
    }>
  | Readonly<{
      loadState: 'loaded';
      moveState: 'computers-turn' | 'humans-turn' | 'correct' | 'wrong';
      sequence: readonly BoardPosition[];
      area: BoardCrop;
      id: string;
      game: GoGame;
    }>;

const computerPlayer = 'white';
const humanPlayer = 'black';

export default function Puzzle({ apiClient }: Props) {
  const [gameState, setGameState] = useState<GameState>({
    loadState: 'loading',
  });

  const loadPuzzle = useCallback(async () => {
    const { id, initialStones, area } = await apiClient.puzzle.getRandom();

    setGameState({
      loadState: 'loaded',
      moveState: 'humans-turn',
      id,
      sequence: [],
      game: GoGame.create(19, {
        [computerPlayer]: initialStones.computer,
        [humanPlayer]: initialStones.you,
      }),
      area: {
        min: [area.min[0] - 2, area.min[1] - 2],
        max: [area.max[0] + 2, area.max[1] + 2],
      },
    });
  }, [apiClient.puzzle]);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  useEffect(() => {
    if (
      gameState.loadState === 'loaded' &&
      gameState.moveState === 'computers-turn'
    ) {
      apiClient.puzzle
        .solve(gameState.id, gameState.sequence)
        .then(response => {
          if (response.type === 'continue') {
            setGameState({
              ...gameState,
              moveState: 'humans-turn',
              game: gameState.game.playValidMove({
                player: computerPlayer,
                position: response.response,
              }),
            });
          } else if (response.type === 'correct' || response.type === 'wrong') {
            setGameState({ ...gameState, moveState: response.type });
          }
        });
    }
  }, [gameState, apiClient.puzzle]);

  const playMove = useCallback((position: BoardPosition) => {
    setGameState(gameState => {
      if (
        gameState.loadState === 'loaded' &&
        gameState.moveState === 'humans-turn'
      ) {
        const newGame = gameState.game.playMove({
          player: humanPlayer,
          position,
        });

        if (either.isLeft(newGame)) {
          return gameState;
        }

        return {
          ...gameState,
          sequence: gameState.sequence.concat([position]),
          game: newGame.right,
          moveState: 'computers-turn',
        };
      } else {
        return gameState;
      }
    });
  }, []);

  const handleNextPuzzle = useCallback(() => {
    setGameState({ loadState: 'loading' });

    loadPuzzle();
  }, [loadPuzzle]);

  if (gameState.loadState === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PuzzleInstructions
        humanPlayer={humanPlayer}
        state={
          gameState.moveState === 'correct' || gameState.moveState === 'wrong'
            ? gameState.moveState
            : 'in-progress'
        }
        onNextPuzzle={handleNextPuzzle}
      />
      <Board game={gameState.game} playMove={playMove} crop={gameState.area} />
    </div>
  );
}

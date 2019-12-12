import Board from './Board';
import React, { useState, useCallback, useEffect } from 'react';
import { GoGame, BoardPosition } from '../model/GoGame';
import { either } from 'fp-ts';
import { ApiClient } from '../api-client';
import PuzzleInstructions from './PuzzleInstructions';
import { classes, style } from './Puzzle.st.css';

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
    const { id, initialStones } = await apiClient.puzzle.getRandom();

    setGameState({
      loadState: 'loaded',
      moveState: 'humans-turn',
      id,
      sequence: [],
      game: GoGame.create(19, {
        [computerPlayer]: initialStones.computer,
        [humanPlayer]: initialStones.you,
      }),
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
    <div className={style(classes.root)}>
      <PuzzleInstructions
        humanPlayer={humanPlayer}
        state={
          gameState.moveState === 'correct' || gameState.moveState === 'wrong'
            ? gameState.moveState
            : 'in-progress'
        }
        onNextPuzzle={handleNextPuzzle}
      />
      <Board game={gameState.game} playMove={playMove} />
    </div>
  );
}

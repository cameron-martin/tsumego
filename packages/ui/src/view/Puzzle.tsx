import React, { useState, useCallback, useEffect } from 'react';
import { Button, makeStyles, Typography, Container } from '@material-ui/core';
import { either } from 'fp-ts';
import { ApiClient } from '@tsumego/api-client';
import Board, { BoardCrop } from './board/Board';
import { GoGame, BoardPosition } from '../model/GoGame';
import PuzzleInstructions from './PuzzleInstructions';
import Loading from './Loading';

interface Props {
  apiClient: ApiClient;
}

type Game =
  | Readonly<{ loadState: 'pending' }>
  | Readonly<{ loadState: 'rejected' }>
  | Readonly<{
      loadState: 'fulfilled';
      moveState: 'computers-turn' | 'humans-turn' | 'correct' | 'wrong';
      sequence: readonly BoardPosition[];
      area: BoardCrop;
      id: string;
      game: GoGame;
    }>;

const computerPlayer = 'white';
const humanPlayer = 'black';

const useStyles = makeStyles({
  root: {
    flex: '1 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default function Puzzle({ apiClient }: Props) {
  const classes = useStyles();

  const [gameState, setGameState] = useState<Game>({
    loadState: 'pending',
  });

  const loadPuzzle = useCallback(async () => {
    setGameState({
      loadState: 'pending',
    });

    try {
      const { id, initialStones, area } = await apiClient.puzzle.getRandom();

      setGameState({
        loadState: 'fulfilled',
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
    } catch (err) {
      setGameState({
        loadState: 'rejected',
      });

      throw err;
    }
  }, [apiClient.puzzle]);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  useEffect(() => {
    if (
      gameState.loadState === 'fulfilled' &&
      gameState.moveState === 'computers-turn'
    ) {
      apiClient.puzzle
        .solve(gameState.id, gameState.sequence)
        .then((response) => {
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
    setGameState((gameState) => {
      if (
        gameState.loadState === 'fulfilled' &&
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
    setGameState({ loadState: 'pending' });

    loadPuzzle();
  }, [loadPuzzle]);

  if (gameState.loadState === 'pending') {
    return <Loading />;
  }

  if (gameState.loadState === 'rejected') {
    return (
      <div className={classes.root}>
        <Typography variant="body1" gutterBottom>
          Failed to load puzzle
        </Typography>
        <Button variant="contained" color="primary" onClick={loadPuzzle}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Container maxWidth="sm">
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
    </Container>
  );
}

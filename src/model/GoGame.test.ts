import { GoGame, MoveValidationReason, GoMove, InvalidMove } from './GoGame';

function expectMoveInvalid(
  game: GoGame,
  move: GoMove,
  reason: MoveValidationReason,
) {
  expect(game.validateMove(move)).toBe(reason);

  let hasThrown = false;
  try {
    game.playMove(move);
  } catch (e) {
    hasThrown = true;
    expect(e).toBeInstanceOf(InvalidMove);
    expect(e).toHaveProperty('reason', reason);
  }

  expect(hasThrown).toBe(true);
}

describe('ending the game', () => {
  test('game is initially not ended', () => {
    expect(GoGame.create(9)).toHaveProperty('ended', false);
  });

  test('when both players pass sequentially, the game ends', () => {
    let game = GoGame.create(9);
    game = game.playMove({ player: 'black', position: 'pass' });
    game = game.playMove({ player: 'white', position: 'pass' });

    expect(game).toHaveProperty('ended', true);
  });

  test('when both players do not pass sequentially, the game does not end', () => {
    let game = GoGame.create(9);
    game = game.playMove({ player: 'black', position: 'pass' });
    game = game.playMove({ player: 'white', position: [1, 1] });

    expect(game).toHaveProperty('ended', false);
  });
});

test('groups are captured when they have no liberties', () => {
  let game = GoGame.create(9);

  game = game.playMoves([
    { player: 'black', position: [0, 0] },
    { player: 'white', position: [0, 1] },
    { player: 'black', position: [5, 5] },
    { player: 'white', position: [1, 0] },
  ]);

  expect(game.getCell([0, 0])).toBe('empty');
  expect(game.capturedStones.white).toBe(1);
  expect(game.capturedStones.black).toBe(0);
});

describe('move validation', () => {
  test('the first move must be by black', () => {
    let game = GoGame.create(9);

    const move = { player: 'white', position: [1, 1] } as const;

    expectMoveInvalid(game, move, MoveValidationReason.OutOfTurn);
  });

  test('the same player cannot play twice in a row', () => {
    let game = GoGame.create(9);

    const move = { player: 'black', position: [1, 1] } as const;

    game = game.playMove(move);

    expectMoveInvalid(game, move, MoveValidationReason.OutOfTurn);
  });

  test('cannot play in an occupied space', () => {
    let game = GoGame.create(9);

    game = game.playMove({ player: 'black', position: [1, 1] });

    expectMoveInvalid(
      game,
      { player: 'white', position: [1, 1] },
      MoveValidationReason.SpaceOccupied,
    );
  });

  test('suicidal moves are not allowed (new group)', () => {
    let game = GoGame.create(9).playMoves([
      { player: 'black', position: [0, 1] },
      { player: 'white', position: 'pass' },
      { player: 'black', position: [1, 0] },
    ]);

    expectMoveInvalid(
      game,
      { player: 'white', position: [0, 0] },
      MoveValidationReason.Suicidal,
    );
  });

  test('suicidal moves are not allowed (existing group)', () => {
    let game = GoGame.create(9).playMoves([
      { player: 'black', position: [0, 1] },
      { player: 'white', position: [0, 0] },
      { player: 'black', position: [1, 1] },
      { player: 'white', position: 'pass' },
      { player: 'black', position: [2, 0] },
    ]);

    expectMoveInvalid(
      game,
      { player: 'white', position: [1, 0] },
      MoveValidationReason.Suicidal,
    );
  });

  test.todo('previous board states are forbidden (ko rule)');

  test.each([[-1, 0], [-1, -1], [10, 7]])(
    'cannot play off the board',
    (x, y) => {
      let game = GoGame.create(9);

      const move = { player: 'black', position: [x, y] } as const;

      expectMoveInvalid(game, move, MoveValidationReason.OffBoard);
    },
  );
});

test('the board starts out empty', () => {
  let game = GoGame.create(9);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      expect(game.getCell([i, j])).toBe('empty');
    }
  }
});

test('stones are on the board after being placed', () => {
  let game = GoGame.create(9);

  game = game.playMove({ player: 'black', position: [1, 1] });

  expect(game.getCell([1, 1])).toBe('black');
});

test('it advances current player', () => {
  let game = GoGame.create(9);

  expect(game.currentPlayer).toBe('black');
  game = game.playMove({ player: 'black', position: [1, 1] });
  expect(game.currentPlayer).toBe('white');
  game = game.playMove({ player: 'white', position: [1, 2] });
  expect(game.currentPlayer).toBe('black');
});

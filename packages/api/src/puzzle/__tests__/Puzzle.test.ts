import { Puzzle } from '../Puzzle';

const simplePuzzle = Puzzle.create({
  initialStones: {
    computer: [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1]],
    you: [[4, 1], [5, 1], [1, 2], [2, 2], [3, 2], [1, 4]],
  },
  sequences: [
    { type: 'leaf', position: [1, 0], outcome: 'correct' },
    { type: 'leaf', position: [2, 0], response: [1, 0], outcome: 'wrong' },
    { type: 'leaf', position: [0, 0], response: [1, 0], outcome: 'wrong' },
    { type: 'leaf', position: [0, 2], response: [1, 0], outcome: 'wrong' },
    { type: 'leaf', position: [4, 0], response: [1, 0], outcome: 'wrong' },
  ],
});

const complexPuzzle = Puzzle.create({
  initialStones: {
    computer: [
      [1, 0],
      [6, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [10, 1],
      [1, 2],
      [7, 2],
      [10, 2],
      [7, 3],
      [9, 3],
    ],
    you: [
      [4, 0],
      [7, 0],
      [0, 1],
      [1, 1],
      [7, 1],
      [8, 1],
      [9, 1],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [1, 3],
    ],
  },
  sequences: [
    {
      type: 'branch',
      position: [3, 0],
      response: [9, 2],
      children: [
        {
          type: 'branch',
          position: [0, 2],
          response: [9, 0],
          children: [
            {
              type: 'leaf',
              position: [2, 0],
              response: [5, 0],
              outcome: 'wrong',
            },
            {
              type: 'leaf',
              position: [0, 0],
              response: [8, 2],
              outcome: 'wrong',
            },
          ],
        },
        {
          type: 'branch',
          position: [2, 0],
          response: [5, 0],
          children: [
            {
              type: 'branch',
              position: [2, 0],
              response: [3, 0],
              children: [
                {
                  type: 'branch',
                  position: [0, 2],
                  response: [9, 0],
                  children: [
                    {
                      type: 'leaf',
                      position: [0, 0],
                      response: [8, 2],
                      outcome: 'wrong',
                    },
                  ],
                },
              ],
            },
            {
              type: 'branch',
              position: [3, 0],
              response: [2, 0],
              children: [
                { type: 'leaf', position: [0, 2], outcome: 'correct' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'branch',
      position: [2, 0],
      response: [3, 0],
      children: [
        {
          type: 'branch',
          position: [0, 2],
          response: [9, 2],
          children: [
            {
              type: 'branch',
              position: [0, 0],
              response: [9, 0],
              children: [{ type: 'leaf', position: [2, 0], outcome: 'wrong' }],
            },
          ],
        },
      ],
    },
    {
      type: 'branch',
      position: [0, 2],
      response: [9, 2],
      children: [
        {
          type: 'branch',
          position: [0, 0],
          response: [8, 2],
          children: [
            {
              type: 'leaf',
              position: [2, 0],
              response: [9, 0],
              outcome: 'wrong',
            },
          ],
        },
        {
          type: 'branch',
          position: [2, 0],
          response: [3, 0],
          children: [
            {
              type: 'branch',
              position: [0, 0],
              response: [9, 0],
              children: [{ type: 'leaf', position: [2, 0], outcome: 'wrong' }],
            },
          ],
        },
        {
          type: 'branch',
          position: [3, 0],
          response: [8, 2],
          children: [
            {
              type: 'branch',
              position: [2, 0],
              response: [5, 0],
              children: [
                {
                  type: 'leaf',
                  position: [3, 0],
                  response: [9, 0],
                  outcome: 'wrong',
                },
                {
                  type: 'leaf',
                  position: [2, 0],
                  response: [9, 0],
                  outcome: 'wrong',
                },
              ],
            },
            {
              type: 'leaf',
              position: [0, 0],
              response: [9, 0],
              outcome: 'wrong',
            },
          ],
        },
      ],
    },
  ],
});

test('unknown moves are wrong', () => {
  const result = simplePuzzle.playSequence([[5, 5]]);

  expect(result).toEqual({ type: 'wrong' });
});

test('immediately correct moves are correct', () => {
  const result = simplePuzzle.playSequence([[1, 0]]);

  expect(result).toEqual({ type: 'correct' });
});

test('immediately wrong known moves are wrong', () => {
  const result = simplePuzzle.playSequence([[2, 0]]);

  expect(result).toEqual({ type: 'wrong', response: [1, 0] });
});

test('incomplete sequences respond with continue', () => {
  const result = complexPuzzle.playSequence([[3, 0], [0, 2]]);

  expect(result).toEqual({ type: 'continue', response: [9, 0] });
});

test('long correct sequences are correct', () => {
  const result = complexPuzzle.playSequence([[3, 0], [2, 0], [3, 0], [0, 2]]);

  expect(result).toEqual({ type: 'correct' });
});

test('long known wrong sequences are wrong', () => {
  const result = complexPuzzle.playSequence([[3, 0], [0, 2], [2, 0]]);

  expect(result).toEqual({ type: 'wrong', response: [5, 0] });
});

// What to do here?
test.todo('sequences that overshoot a correct/incorrect sequence');

test('empty sequence throws error', () => {
  expect(() => simplePuzzle.playSequence([])).toThrow(
    'Sequence cannot be empty',
  );
});

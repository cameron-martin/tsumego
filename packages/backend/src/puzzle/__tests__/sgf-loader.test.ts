/**
 * @jest-environment node
 */

import { promises as fs } from 'fs';
import path from 'path';
import { loadSgf } from '../sgf-loader';
import { PuzzleSpec, Player } from '../Puzzle';

test('snapshots', async () => {
  const file = await fs.readFile(
    path.join(
      __dirname,
      'sgfs',
      'puzzles',
      'CD 1 - FAMOUS TSUMEGO COMPOSERS',
      'CHO CHIKUN Encyclopedia Life And Death - Elementary',
      'prob0001.sgf',
    ),
    'utf8',
  );

  const expected: PuzzleSpec = {
    initialStones: {
      [Player.Computer]: [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1]],
      [Player.You]: [[4, 1], [5, 1], [1, 2], [2, 2], [3, 2], [1, 4]],
    },
    sequences: [
      { position: [1, 0], outcome: 'correct' },
      { position: [2, 0], outcome: 'wrong' },
      { position: [0, 0], outcome: 'wrong' },
      { position: [0, 1], outcome: 'wrong' },
      { position: [4, 0], outcome: 'wrong' },
    ],
  };

  expect(loadSgf(file)).toEqual(expected);
});

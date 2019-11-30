/**
 * @jest-environment node
 */

import { promises as fs } from 'fs';
import path from 'path';
import { loadSgf } from '../sgf-loader';
import { PuzzleSpec, Player } from '../Puzzle';

test('Cho Chikun #1', async () => {
  const file = await fs.readFile(
    path.join(
      __dirname,
      '..',
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
      { type: 'leaf', position: [1, 0], outcome: 'correct' },
      { type: 'leaf', position: [2, 0], response: [1, 0], outcome: 'wrong' },
      { type: 'leaf', position: [0, 0], response: [1, 0], outcome: 'wrong' },
      { type: 'leaf', position: [0, 2], response: [1, 0], outcome: 'wrong' },
      { type: 'leaf', position: [4, 0], response: [1, 0], outcome: 'wrong' },
    ],
  };

  expect(loadSgf(file)).toEqual(expected);
});

test('Cho Chikun #2', async () => {
  const file = await fs.readFile(
    path.join(
      __dirname,
      '..',
      'sgfs',
      'puzzles',
      'CD 1 - FAMOUS TSUMEGO COMPOSERS',
      'CHO CHIKUN Encyclopedia Life And Death - Others',
      'prob0002.sgf',
    ),
    'utf8',
  );

  const expected: PuzzleSpec = {
    initialStones: {
      [Player.Computer]: [
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
      [Player.You]: [
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
                children: [
                  { type: 'leaf', position: [2, 0], outcome: 'wrong' },
                ],
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
                children: [
                  { type: 'leaf', position: [2, 0], outcome: 'wrong' },
                ],
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
  };

  expect(loadSgf(file)).toEqual(expected);
});

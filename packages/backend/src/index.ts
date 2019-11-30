import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Puzzle } from './puzzle/Puzzle';
import { loadSgf } from './puzzle/sgf-loader';
import { random } from 'lodash';
import bodyParser from 'body-parser';
import cors from 'cors';

process.on('unhandledRejection', err => {
  throw err;
});

const puzzleDir = path.join(
  __dirname,
  '..',
  'src',
  'puzzle',
  'sgfs',
  'puzzles',
  'CD 1 - FAMOUS TSUMEGO COMPOSERS',
  'CHO CHIKUN Encyclopedia Life And Death - Elementary',
);

(async () => {
  const puzzles = await loadPuzzles();
  const puzzleIds = Array.from(puzzles.keys());
  const app = express();

  app.use(bodyParser.json());
  app.use(
    cors({
      origin: true,
      methods: ['POST', 'GET'],
      allowedHeaders: ['Content-Type'],
    }),
  );

  app.get('/puzzle/random', (req, res) => {
    const randomId = puzzleIds[random(0, puzzleIds.length - 1)];

    res.status(307);
    res.set('Location', `/puzzle/${randomId}`);
    res.end();
  });

  app.get('/puzzle/:puzzleId', (req, res) => {
    const puzzle = puzzles.get(req.params.puzzleId);

    if (!puzzle) {
      res.status(404).end();
      return;
    }

    res.json({ id: req.params.puzzleId, initialStones: puzzle.initialStones });
  });

  app.post('/puzzle/:puzzleId/solution', (req, res) => {
    const puzzle = puzzles.get(req.params.puzzleId);

    if (!puzzle) {
      res.status(404).end();
      return;
    }

    const response = puzzle.playSequence(req.body);

    res.json(response);
  });

  app.listen(8080);
})();

async function loadPuzzles(): Promise<Map<string, Puzzle>> {
  const puzzles = new Map<string, Puzzle>();
  let id = 1;

  for (const puzzleFile of await fs.readdir(puzzleDir)) {
    const sgf = await fs.readFile(path.join(puzzleDir, puzzleFile), 'utf8');

    puzzles.set((id++).toString(), Puzzle.create(loadSgf(sgf)));
  }

  return puzzles;
}

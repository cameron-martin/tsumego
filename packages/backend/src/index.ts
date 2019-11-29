import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Puzzle } from './puzzle/Puzzle';
import { loadSgf } from './puzzle/sgf-loader';
import { random } from 'lodash';

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

  app.get('/puzzle/random', (req, res) => {
    const randomId = puzzleIds[random(0, puzzleIds.length - 1)];

    // TODO: Check this is the correct status code once I have internet.
    res.status(301);
    res.set('Location', `/puzzle/${randomId}`);
    res.end();
  });

  app.get('/puzzle/:puzzleId', (req, res) => {
    const puzzle = puzzles.get(req.params.puzzleId);

    if (!puzzle) {
      res.status(404).end();
      return;
    }

    res.json({ initialStones: puzzle.initialStones });
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

import './env';
import express, { ErrorRequestHandler } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Puzzle } from './puzzle/Puzzle';
import { loadSgf } from './puzzle/sgf-loader';
import { random } from 'lodash';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = function(err, req, res, next) {
  if (err instanceof jwt.UnauthorizedError) {
    res.status(401).json({ message: err.message });
  }
};

const cognitoIdpUri = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;

(async () => {
  const puzzles = await loadPuzzles();
  const puzzleIds = Array.from(puzzles.keys());
  const app = express();

  app.use(
    cors({
      origin: true,
      methods: ['POST', 'GET'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(function(req, res, next) {
    console.log(req.headers);
    next();
  });

  console.log(`${cognitoIdpUri}/.well-known/jwks.json`);

  app.use(
    jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${cognitoIdpUri}/.well-known/jwks.json`,
      }),
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: cognitoIdpUri,
      algorithms: ['RS256'],
    }),
  );

  app.use(bodyParser.json());

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

  app.use(errorHandler);

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

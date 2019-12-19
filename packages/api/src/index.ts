import './env';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import jwksRsa from 'jwks-rsa';
import Router from 'express-promise-router';
import PuzzleRepository from './puzzle/PuzzleRepository';
import { loadSgf } from './puzzle/sgf-loader';
import { Puzzle } from './puzzle/Puzzle';
import { Pool } from 'pg';

class NotAuthorized extends Error {}

process.on('unhandledRejection', err => {
  throw err;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = function(err, req, res, next) {
  // TODO: Hide stack in development
  if (err instanceof jwt.UnauthorizedError) {
    res.status(401).json({ message: err.message, stack: err.stack });
  } else if (err instanceof NotAuthorized) {
    res.status(403).json({ message: err.message, stack: err.stack });
  } else {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const pool = new Pool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const puzzleRepository = new PuzzleRepository(pool);

const cognitoIdpUri = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;

const app = express();
const router = Router();

app.use(
  cors({
    origin: true,
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

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
  }).unless({ path: '/status' }),
);

app.use(bodyParser.json());

router.get('/puzzle/random', async (req, res) => {
  const puzzle = await puzzleRepository.getRandom();

  if (!puzzle) {
    res.status(404).end();
    return;
  }

  res.json({
    id: puzzle.id,
    initialStones: puzzle.entity.initialStones,
    area: puzzle.entity.area,
  });
});

router.post('/puzzle/:puzzleId/solution', async (req, res) => {
  const puzzle = await puzzleRepository.get(
    Number.parseInt(req.params.puzzleId),
  );

  if (!puzzle) {
    res.status(404).end();
    return;
  }

  const response = puzzle.entity.playSequence(req.body);

  res.json(response);
});

router.post('/puzzle', async (req, res) => {
  if (!req.user?.['cognito:groups']?.includes('admin')) {
    throw new NotAuthorized();
  }

  await puzzleRepository.create(Puzzle.create(loadSgf(req.body.file)));

  res.status(201).end();
});

router.get('/status', async (req, res) => {
  res.status(200).send('OK');
});

app.use(router);

app.use(errorHandler);

app.listen(8080);

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

process.on('unhandledRejection', err => {
  throw err;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = function(err, req, res, next) {
  // TODO: Hide stack in development
  if (err instanceof jwt.UnauthorizedError) {
    res.status(401).json({ message: err.message, stack: err.stack });
  } else {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const puzzleRepository = PuzzleRepository.fromConnectionString(
  process.env.DB_CONNECTION_STRING!,
);

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
  }),
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
  await puzzleRepository.create(Puzzle.create(loadSgf(req.body.file)));

  res.status(201).end();
});

app.use(router);

app.use(errorHandler);

app.listen(8080);

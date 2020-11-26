import './env';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import Router from 'express-promise-router';
import { Pool } from 'pg';
import PuzzleRepository from './puzzle/PuzzleRepository';
import { loadSgf } from './puzzle/sgf-loader';
import { Puzzle } from './puzzle/Puzzle';
import { GameResultRepository } from './game-results/GameResultRepository';
import { createAuthMiddleware, GOOGLE_ISSUER } from './authentication';
import { getToken } from './Token';
import { RatingRepository } from './ratings/RatingRepository';
import { Rating } from './ratings/Rating';
import { sampleWinProbability } from './ratings/win-probability';
import { rate } from './services/rate';
import { Record, String } from 'runtypes';

class NotAuthorized extends Error {}

process.on('unhandledRejection', (err) => {
  throw err;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  // TODO: Hide stack in production
  if (err instanceof jwt.UnauthorizedError) {
    res.status(401).json({ message: err.message, stack: err.stack });
  } else if (err instanceof NotAuthorized) {
    res.status(403).json({ message: err.message, stack: err.stack });
  } else if (err instanceof Error) {
    res.status(500).json({ message: err.message, stack: err.stack });
  } else {
    res.status(500).json({ message: 'Unknown error', stack: '' });
  }
};

const pool = new Pool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const puzzleRepository = new PuzzleRepository(pool);
const gameResultRespository = new GameResultRepository(pool);
const ratingRepository = new RatingRepository(pool);

const cognitoIdpUri = `https://cognito-idp.${process.env
  .COGNITO_REGION!}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID!}`;

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
  createAuthMiddleware({
    cognitoIdpUri,
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    gcpAudience: process.env.GCP_AUDIENCE,
  }).unless({
    path: '/status',
  }),
);

app.use(bodyParser.json());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/puzzle/random', async (req, res) => {
  const token = getToken(req);

  const usersRating =
    (await ratingRepository.getLatestForUser(token.sub))?.entity
      .currentRating ?? Rating.default(new Date());

  const puzzle = await puzzleRepository.getRandom(
    token.sub,
    usersRating,
    sampleWinProbability(),
  );

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

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/puzzle/:puzzleId/solution', async (req, res) => {
  const token = getToken(req);

  const puzzle = await puzzleRepository.get(
    Number.parseInt(req.params.puzzleId),
  );

  if (!puzzle) {
    res.status(404).end();
    return;
  }

  const response = puzzle.entity.playSequence(req.body);

  if (response.type !== 'continue') {
    await gameResultRespository.create({
      result: response.type,
      puzzleId: puzzle.id,
      userId: token.sub,
      playedAt: new Date(),
    });
  }

  res.json(response);
});

const PuzzleBody = Record({ file: String });

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/puzzle', async (req, res) => {
  const token = getToken(req);

  if (!token['cognito:groups']?.includes('admin')) {
    throw new NotAuthorized();
  }

  const body = PuzzleBody.check(req.body);

  await puzzleRepository.create(Puzzle.create(loadSgf(body.file)));

  res.status(201).end();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/user-ratings', async (req, res) => {
  const token = getToken(req);

  if (!token['cognito:groups']?.includes('admin')) {
    throw new NotAuthorized();
  }

  const ratings = await ratingRepository.getLatestForAllUsers();

  res.json(
    ratings.map((rating) => {
      const currentRating = rating.entity.rating.currentRating;

      return {
        id: rating.id,
        userId: rating.entity.userId,
        mean: currentRating.mean,
        deviation: currentRating.deviation,
      };
    }),
  );
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/rate', async (req, res) => {
  const token = getToken(req);

  if (
    !token['cognito:groups']?.includes('admin') &&
    token.iss !== GOOGLE_ISSUER
  ) {
    throw new NotAuthorized();
  }

  res.json(await rate(ratingRepository, gameResultRespository));
});

router.get('/status', (req, res) => {
  res.status(200).send('OK');
});

app.use(router);

app.use(errorHandler);

app.listen(8080);

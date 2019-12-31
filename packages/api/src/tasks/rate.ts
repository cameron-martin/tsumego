import '../env';
import { Pool } from 'pg';
import { GameResultRepository } from '../game-results/GameResultRepository';
import { RatingRepository } from '../ratings/RatingRepository';
import { Rating } from '../ratings/Rating';

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

(async () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    idleTimeoutMillis: 300,
  });

  const ratingRepository = new RatingRepository(pool);

  const latestRating = await ratingRepository.getLatest();

  const results = await new GameResultRepository(pool).getPlayedAfter(
    latestRating?.entity.ratedAt ?? new Date(0),
  );

  for (const result of results) {
    const preUserRating =
      (
        await ratingRepository.getLatestForUser(result.entity.userId)
      )?.entity.decay(result.entity.playedAt) ??
      Rating.default(result.entity.playedAt);

    const prePuzzleRating =
      (
        await ratingRepository.getLatestForPuzzle(result.entity.puzzleId)
      )?.entity.decay(result.entity.playedAt) ??
      Rating.default(result.entity.playedAt);

    const postUserRating = preUserRating.applyGames([
      {
        won: result.entity.result === 'correct',
        opponentRating: prePuzzleRating,
      },
    ]);

    const postPuzzleRating = prePuzzleRating.applyGames([
      { won: result.entity.result === 'wrong', opponentRating: preUserRating },
    ]);

    await Promise.all([
      ratingRepository.createUserRating(result.entity.userId, postUserRating),
      ratingRepository.createPuzzleRating(
        result.entity.puzzleId,
        postPuzzleRating,
      ),
    ]);

    console.log(
      `Rated user ${result.entity.userId} for puzzle ${result.entity.puzzleId} at ${result.entity.playedAt}`,
    );
  }
})();

import { GameResultRepository } from '../game-results/GameResultRepository';
import { RatingRepository } from '../ratings/RatingRepository';
import { Rating } from '../ratings/Rating';

interface RateResult {
  userId: string;
  puzzleId: number;
  ratedAt: Date;
}

export async function rate(
  ratingRepository: RatingRepository,
  gameResultRepository: GameResultRepository,
): Promise<RateResult[]> {
  const rateResults: RateResult[] = [];

  const latestRating = await ratingRepository.getLatest();

  const results = await gameResultRepository.getPlayedAfter(
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

    rateResults.push({
      userId: result.entity.userId,
      puzzleId: result.entity.puzzleId,
      ratedAt: result.entity.playedAt,
    });
  }

  return rateResults;
}

import { Rating } from './Rating';
import { Pool, QueryConfig } from 'pg';
import { WithId } from '../WithId';
import { UserRating } from './UserRating';

export class RatingRepository {
  constructor(private readonly pool: Pool) {}

  getLatest(): Promise<WithId<Rating> | null> {
    return this.getOne(
      'SELECT id, mean, deviation, rated_at FROM ratings ORDER BY rated_at DESC LIMIT 1',
    );
  }

  getLatestForUser(userId: string): Promise<WithId<Rating> | null> {
    return this.getOne({
      text:
        'SELECT id, mean, deviation, rated_at FROM user_ratings WHERE user_id = $1 ORDER BY rated_at DESC LIMIT 1',
      values: [userId],
    });
  }

  async getLatestForAllUsers(): Promise<Array<WithId<UserRating>>> {
    const result = await this.pool.query({
      text:
        'SELECT DISTINCT ON (user_id) id, mean, deviation, rated_at, user_id FROM user_ratings ORDER BY user_id, rated_at DESC',
      values: [],
    });

    return result.rows.map((row) => ({
      id: row.id,
      entity: {
        userId: row.user_id,
        rating: new Rating({
          deviation: row.deviation,
          mean: row.mean,
          ratedAt: row.rated_at,
        }),
      },
    }));
  }

  getLatestForPuzzle(puzzleId: number): Promise<WithId<Rating> | null> {
    return this.getOne({
      text:
        'SELECT id, mean, deviation, rated_at FROM puzzle_ratings WHERE puzzle_id = $1 ORDER BY rated_at DESC LIMIT 1',
      values: [puzzleId],
    });
  }

  async createUserRating(userId: string, rating: Rating): Promise<void> {
    await this.pool.query({
      text:
        'INSERT INTO user_ratings (mean, deviation, rated_at, user_id) VALUES ($1, $2, $3, $4)',
      values: [rating.mean, rating.deviation, rating.ratedAt, userId],
    });
  }

  async createPuzzleRating(puzzleId: number, rating: Rating): Promise<void> {
    await this.pool.query({
      text:
        'INSERT INTO puzzle_ratings (mean, deviation, rated_at, puzzle_id) VALUES ($1, $2, $3, $4)',
      values: [rating.mean, rating.deviation, rating.ratedAt, puzzleId],
    });
  }

  private async getOne(query: string | QueryConfig) {
    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      entity: new Rating({
        deviation: row.deviation,
        mean: row.mean,
        ratedAt: row.rated_at,
      }),
    };
  }
}

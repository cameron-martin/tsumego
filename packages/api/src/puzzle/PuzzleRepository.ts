import { Pool, QueryConfig } from 'pg';
import { Puzzle } from './Puzzle';
import { WithId, withId } from '../WithId';
import { Rating } from '../ratings/Rating';

export default class PuzzleRepository {
  constructor(private readonly pool: Pool) {}

  async create(puzzle: Puzzle): Promise<number> {
    const res = await this.pool.query(
      'INSERT INTO puzzles(puzzle) VALUES ($1) RETURNING id',
      [JSON.stringify(puzzle.spec)],
    );

    return res.rows[0].id;
  }

  get(id: number): Promise<WithId<Puzzle> | null> {
    return this.queryOne({
      text: 'SELECT id, puzzle FROM puzzles WHERE id = $1',
      values: [id],
    });
  }

  /**
   * Gets a random puzzle which is of appropriate difficulty for a user with rating `rating`.
   */
  getRandom(rating: Rating): Promise<WithId<Puzzle> | null> {
    const defaultRating = Rating.default(new Date());

    return this.queryOne({
      text: `
        SELECT
          puzzles.id, puzzle, ABS(normal_rand(1, COALESCE(mean, $1), COALESCE(deviation, $2)) - $3) AS diff
        FROM puzzles
        LEFT JOIN LATERAL (
          SELECT mean, deviation
          FROM puzzle_ratings
          WHERE puzzle_ratings.puzzle_id = puzzles.id
          ORDER BY puzzle_ratings.rated_at DESC LIMIT 1
        ) pr ON true ORDER BY diff LIMIT 1;
      `,
      values: [defaultRating.mean, defaultRating.deviation, rating.sample()],
    });
  }

  private async queryOne(config: QueryConfig): Promise<WithId<Puzzle> | null> {
    const res = await this.pool.query(config);

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];

    return withId(row.id, Puzzle.create(row.puzzle));
  }
}

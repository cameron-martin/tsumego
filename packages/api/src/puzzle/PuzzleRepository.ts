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
   * Gets a random puzzle with an approximate winning probability for a user with rating `rating`.
   */
  getRandom(
    userId: string,
    rating: Rating,
    winProbability: number,
  ): Promise<WithId<Puzzle> | null> {
    const defaultRating = Rating.default(new Date(0));

    return this.queryOne({
      text: `
        SELECT
          puzzles.id, puzzle, ABS(glicko_win_probability(COALESCE(mean, $1), COALESCE(deviation, $2), $3, $4) - $5) AS diff
        FROM puzzles
        LEFT JOIN LATERAL (
          SELECT mean, deviation
          FROM puzzle_ratings
          WHERE puzzle_ratings.puzzle_id = puzzles.id
          ORDER BY puzzle_ratings.rated_at DESC
          LIMIT 1
        ) pr ON true
        LEFT JOIN LATERAL (
          SELECT played_at AS last_played_at
          FROM game_results
          WHERE game_results.puzzle_id = puzzles.id
          AND game_results.user_id = $6
          ORDER BY game_results.played_at DESC
          LIMIT 1
        ) gr ON true
        WHERE last_played_at IS NULL OR current_timestamp - last_played_at > interval '20 days'
        ORDER BY diff, RANDOM() LIMIT 1;
      `,
      values: [
        defaultRating.mean,
        defaultRating.deviation,
        rating.mean,
        rating.deviation,
        winProbability,
        userId,
      ],
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

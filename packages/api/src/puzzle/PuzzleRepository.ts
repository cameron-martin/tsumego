import { Pool, QueryConfig } from 'pg';
import { Puzzle } from './Puzzle';
import { WithId, withId } from '../WithId';
import { withClient } from '../common/data-access';

export default class PuzzleRepository {
  constructor(private readonly pool: Pool) {}

  create(puzzle: Puzzle): Promise<number> {
    return withClient(this.pool, async client => {
      const res = await client.query(
        'INSERT INTO puzzles(puzzle) VALUES ($1) RETURNING id',
        [JSON.stringify(puzzle.spec)],
      );

      return res.rows[0].id;
    });
  }

  get(id: number): Promise<WithId<Puzzle> | null> {
    return this.queryOne({
      text: 'SELECT id, puzzle FROM puzzles WHERE id = $1',
      values: [id],
    });
  }

  getRandom(): Promise<WithId<Puzzle> | null> {
    return this.queryOne({
      text: 'SELECT id, puzzle FROM puzzles ORDER BY RANDOM() LIMIT 1',
    });
  }

  private queryOne(config: QueryConfig): Promise<WithId<Puzzle> | null> {
    return withClient(this.pool, async client => {
      const res = await client.query(config);

      if (res.rows.length === 0) {
        return null;
      }

      const row = res.rows[0];

      return withId(row.id, Puzzle.create(row.puzzle));
    });
  }
}

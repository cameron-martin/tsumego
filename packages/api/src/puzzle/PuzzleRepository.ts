import { Pool, QueryConfig } from 'pg';
import { Puzzle } from './Puzzle';
import { WithId, withId } from '../WithId';

export default class PuzzleRepository {
  constructor(private readonly pool: Pool) {}

  async create(puzzle: Puzzle): Promise<number> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'INSERT INTO puzzles(puzzle) VALUES ($1) RETURNING id',
        [JSON.stringify(puzzle.spec)],
      );

      return res.rows[0].id;
    } finally {
      client.release();
    }
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

  private async queryOne(config: QueryConfig): Promise<WithId<Puzzle> | null> {
    const client = await this.pool.connect();

    try {
      const res = await client.query(config);

      if (res.rows.length === 0) {
        return null;
      }

      const row = res.rows[0];

      return withId(row.id, Puzzle.create(row.puzzle));
    } finally {
      client.release();
    }
  }
}

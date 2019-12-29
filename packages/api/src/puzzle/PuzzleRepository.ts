import { Pool, QueryConfig } from 'pg';
import { Puzzle } from './Puzzle';
import { WithId, withId } from '../WithId';

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

  getRandom(): Promise<WithId<Puzzle> | null> {
    return this.queryOne({
      text: 'SELECT id, puzzle FROM puzzles ORDER BY RANDOM() LIMIT 1',
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

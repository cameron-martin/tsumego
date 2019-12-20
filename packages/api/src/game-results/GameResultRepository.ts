import { GameResult } from './GameResult';
import { Pool } from 'pg';

export class GameResultRepository {
  constructor(private readonly pool: Pool) {}

  async create(gameResult: GameResult): Promise<void> {
    const client = await this.pool.connect();

    try {
      const userWon = gameResult.result === 'correct';

      await client.query({
        text: `INSERT INTO game_results (puzzle_id, user_id, user_won, played_at) VALUES ($1, $2, $3, $4)`,
        values: [
          gameResult.puzzleId,
          gameResult.userId,
          userWon,
          gameResult.playedAt,
        ],
      });
    } finally {
      client.release();
    }
  }
}

import { Pool } from 'pg';
import { GameResult } from './GameResult';

export class GameResultRepository {
  constructor(private readonly pool: Pool) {}

  async create(gameResult: GameResult): Promise<void> {
    const userWon = gameResult.result === 'correct';

    await this.pool.query({
      text: `INSERT INTO game_results (puzzle_id, user_id, user_won, played_at) VALUES ($1, $2, $3, $4)`,
      values: [
        gameResult.puzzleId,
        gameResult.userId,
        userWon,
        gameResult.playedAt,
      ],
    });
  }
}

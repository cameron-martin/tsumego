import { GameResult } from './GameResult';
import { Pool } from 'pg';
import { withClient } from '../common/data-access';

export class GameResultRepository {
  constructor(private readonly pool: Pool) {}

  async create(gameResult: GameResult): Promise<void> {
    const userWon = gameResult.result === 'correct';

    await withClient(this.pool, client =>
      client.query({
        text: `INSERT INTO game_results (puzzle_id, user_id, user_won, played_at) VALUES ($1, $2, $3, $4)`,
        values: [
          gameResult.puzzleId,
          gameResult.userId,
          userWon,
          gameResult.playedAt,
        ],
      }),
    );
  }
}

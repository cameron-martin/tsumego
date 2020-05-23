import { Pool } from 'pg';
import { GameResult } from './GameResult';
import { WithId } from '../WithId';

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

  /**
   * Gets game results that were played after a certain date, in date ascending order.
   *
   * TODO: Make this stream results
   */
  async getPlayedAfter(date: Date): Promise<Array<WithId<GameResult>>> {
    interface Row {
      id: number;
      puzzle_id: number;
      user_id: string;
      user_won: boolean;
      played_at: Date;
    }

    const result = await this.pool.query<Row>({
      text:
        'SELECT id, puzzle_id, user_id, user_won, played_at FROM game_results WHERE played_at > $1 ORDER BY played_at ASC',
      values: [date],
    });

    return result.rows.map((row) => ({
      id: row.id,
      entity: {
        puzzleId: row.puzzle_id,
        userId: row.user_id,
        result: row.user_won ? 'correct' : 'wrong',
        playedAt: row.played_at,
      },
    }));
  }
}

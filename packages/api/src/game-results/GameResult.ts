export interface GameResult {
  result: 'wrong' | 'correct';
  puzzleId: number;
  userId: string;
  playedAt: Date;
}

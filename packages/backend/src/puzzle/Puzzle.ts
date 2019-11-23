export enum Player {
  You,
  Computer,
}

export type BoardPosition = [number, number];

export type PlayResult =
  | { type: 'wrong'; response?: BoardPosition }
  | { type: 'correct' }
  | { type: 'continue'; response: BoardPosition };

export class Puzzle {
  static create(spec: PuzzleSpec) {}

  private constructor(public readonly data: PuzzleSpec) {}

  playSequence(positions: Position[]): PlayResult {}
}

export interface PuzzleSpec {
  sequences: PuzzleBranch[];
  initialStones: { player: Player; position: Position }[];
  nextTurn: Player;
}

export type PuzzleTree = PuzzleBranch | PuzzleLeaf;

export interface PuzzleBranch {
  position: BoardPosition;
  response: BoardPosition;
  children: PuzzleTree[];
}

export interface PuzzleLeaf {
  position: BoardPosition;
  response?: BoardPosition;
  outcome: 'correct' | 'wrong';
}

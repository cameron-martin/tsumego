export enum Player {
  You,
  Computer,
}

export type BoardPosition = readonly [number, number];

export type PlayResult =
  | { type: 'wrong'; response?: BoardPosition }
  | { type: 'correct' }
  | { type: 'continue'; response: BoardPosition };

export class Puzzle {
  static create(spec: PuzzleSpec) {}

  private constructor(public readonly data: PuzzleSpec) {}

  playSequence(positions: BoardPosition[]): PlayResult {}
}

export interface InitialStones {
  [Player.You]: BoardPosition[];
  [Player.Computer]: BoardPosition[];
}

export interface PuzzleSpec {
  sequences: PuzzleTree[];
  initialStones: InitialStones;
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

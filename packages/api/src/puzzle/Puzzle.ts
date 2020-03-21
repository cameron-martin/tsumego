export type BoardPosition = readonly [number, number];

export type PlayResult =
  | { type: 'wrong'; response?: BoardPosition }
  | { type: 'correct' }
  | { type: 'continue'; response: BoardPosition };

const positionEquals = (position1: BoardPosition, position2: BoardPosition) =>
  position1[0] === position2[0] && position1[1] === position2[1];

export class Puzzle {
  static create(spec: PuzzleSpec) {
    return new Puzzle(spec);
  }

  readonly initialStones: InitialStones;
  readonly sequences: PuzzleTree[];

  private constructor(spec: PuzzleSpec) {
    this.initialStones = spec.initialStones;
    this.sequences = spec.sequences;
  }

  get spec(): PuzzleSpec {
    return { initialStones: this.initialStones, sequences: this.sequences };
  }

  playSequence(positions: BoardPosition[]): PlayResult {
    let sequences = this.sequences;

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];

      const sequence = sequences.find((sequence) =>
        positionEquals(sequence.position, position),
      );

      if (!sequence) {
        return {
          type: 'wrong',
        };
      }

      if (sequence.type === 'leaf') {
        if (sequence.outcome === 'correct') {
          return { type: 'correct' };
        }

        if (sequence.outcome === 'wrong') {
          return { type: 'wrong', response: sequence.response };
        }
      } else if (i === positions.length - 1) {
        return { type: 'continue', response: sequence.response };
      } else {
        sequences = sequence.children;
      }
    }

    throw new Error('Sequence cannot be empty');
  }

  get area(): { min: BoardPosition; max: BoardPosition } {
    const min: [number, number] = [Infinity, Infinity];
    const max: [number, number] = [-Infinity, -Infinity];

    const processPosition = (stone: BoardPosition) => {
      min[0] = Math.min(min[0], stone[0]);
      min[1] = Math.min(min[1], stone[1]);
      max[0] = Math.max(max[0], stone[0]);
      max[1] = Math.max(max[1], stone[1]);
    };
    this.initialStones.you.forEach(processPosition);
    this.initialStones.computer.forEach(processPosition);
    this.sequences.forEach(function processNode(node) {
      processPosition(node.position);
      if (node.response) {
        processPosition(node.response);
      }

      if (node.type === 'branch') {
        node.children.forEach(processNode);
      }
    });

    return { min, max };
  }
}

export interface InitialStones {
  you: BoardPosition[];
  computer: BoardPosition[];
}

export interface PuzzleSpec {
  sequences: PuzzleTree[];
  initialStones: InitialStones;
}

export type PuzzleTree = PuzzleBranch | PuzzleLeaf;

export interface PuzzleBranch {
  type: 'branch';
  position: BoardPosition;
  response: BoardPosition;
  children: PuzzleTree[];
}

export interface PuzzleLeaf {
  type: 'leaf';
  position: BoardPosition;
  response?: BoardPosition;
  outcome: Outcome;
}

export type Outcome = 'correct' | 'wrong';

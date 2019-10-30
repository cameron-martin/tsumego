export type GoPlayer = 'black' | 'white';
export type CellState = GoPlayer | 'empty';

export class InvalidMove extends Error {
  constructor(public readonly reason: MoveValidationReason) {
    super('Invalid move');
  }
}

export enum MoveValidationReason {
  OutOfTurn,
  SpaceOccupied,
  OffBoard,
  Suicidal,
}

export type BoardPosition = readonly [number, number];

export interface GoMove {
  player: GoPlayer;
  position: BoardPosition | 'pass';
}

const nextPlayer = { white: 'black', black: 'white' } as const;

export class GoGame {
  static create(boardSize: number) {
    return new GoGame(boardSize);
  }

  private constructor(
    public readonly boardSize: number,
    public readonly ended = false,
    private readonly lastMove: GoMove | null = null,
    private readonly boardCells: ReadonlyArray<CellState> = Array(
      boardSize ** 2,
    ).fill('empty'),
  ) {}

  playMove(move: GoMove): GoGame {
    const validationReason = this.validateMove(move);

    if (validationReason != null) {
      throw new InvalidMove(validationReason);
    }

    const ended =
      move.position === 'pass' &&
      this.lastMove != null &&
      this.lastMove.position === 'pass';

    let boardCells = this.boardCells;
    if (move.position !== 'pass') {
      const newCells = [...this.boardCells];
      newCells[this.getIndex(...move.position)] = move.player;
      boardCells = newCells;
    }

    return new GoGame(this.boardSize, ended, move, boardCells);
  }

  validateMove(move: GoMove): MoveValidationReason | null {
    if (this.currentPlayer !== move.player) {
      return MoveValidationReason.OutOfTurn;
    }

    if (move.position != 'pass') {
      if (
        move.position[0] < 0 ||
        move.position[1] < 0 ||
        move.position[0] >= this.boardSize ||
        move.position[1] >= this.boardSize
      ) {
        return MoveValidationReason.OffBoard;
      }

      if (this.getCell(...move.position) !== 'empty') {
        return MoveValidationReason.SpaceOccupied;
      }
    }

    return null;
  }

  get currentPlayer() {
    return nextPlayer[this.lastMove ? this.lastMove.player : 'white'];
  }

  getCell(x: number, y: number): CellState {
    return this.boardCells[this.getIndex(x, y)];
  }

  private getIndex(x: number, y: number) {
    return this.boardSize * x + y;
  }
}

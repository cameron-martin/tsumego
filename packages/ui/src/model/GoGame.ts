import Immutable from 'immutable';
import { either } from 'fp-ts';
import { countWhere, uniq } from './collections';

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

const otherPlayer = { white: 'black', black: 'white' } as const;

const getIndex = (boardSize: number, position: BoardPosition) =>
  boardSize * position[0] + position[1];

const inNonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export class GoGame {
  static create(
    boardSize: number,
    initialStones?: { readonly [K in GoPlayer]: BoardPosition[] },
  ) {
    let groupCollection = GroupCollection.create(boardSize);

    if (initialStones) {
      for (const player of ['white', 'black'] as const) {
        for (const position of initialStones[player]) {
          groupCollection = groupCollection.addStone(
            player,
            getIndex(boardSize, position),
          );
        }
      }
    }

    return new GoGame(
      boardSize,
      false,
      null,
      groupCollection,
      {
        white: 0,
        black: 0,
      },
      null,
    );
  }

  private constructor(
    public readonly boardSize: number,
    public readonly ended: boolean,
    private readonly lastMove: GoMove | null,
    private readonly groupCollection: GroupCollection,
    public readonly capturedStones: { readonly [K in GoPlayer]: number },
    public readonly lastPlacedStone: BoardPosition | null,
  ) {}

  playValidMoves(moves: GoMove[]) {
    return moves.reduce<GoGame>((game, move) => game.playValidMove(move), this);
  }

  playMove(move: GoMove): either.Either<MoveValidationReason, GoGame> {
    const validationReason = this.validateMove(move);

    if (validationReason != null) {
      return either.left(validationReason);
    }

    const ended =
      move.position === 'pass' &&
      this.lastMove != null &&
      this.lastMove.position === 'pass';

    let groupCollection = this.groupCollection;
    let capturedStones = this.capturedStones;
    if (move.position !== 'pass') {
      const moveIndex = this.getIndex(move.position);

      groupCollection = groupCollection.addStone(move.player, moveIndex);
      const myGroup = groupCollection.getGroupAtIndex(moveIndex)!;
      const otherAdjacentGroups = groupCollection
        .getAdjacentGroups(moveIndex)
        .filter((group) => group !== myGroup);

      otherAdjacentGroups.forEach((group) => {
        if (groupCollection.getLibertiesOfGroup(group) === 0) {
          groupCollection = groupCollection.removeGroup(group);
          const capturingPlayer = otherPlayer[group.player];
          capturedStones = {
            ...capturedStones,
            [capturingPlayer]:
              capturedStones[capturingPlayer] + group.indicies.length,
          };
        }
      });
      if (groupCollection.getLibertiesOfGroup(myGroup) === 0) {
        return either.left(MoveValidationReason.Suicidal);
      }
    }

    return either.right(
      new GoGame(
        this.boardSize,
        ended,
        move,
        groupCollection,
        capturedStones,
        move.position != 'pass' ? move.position : this.lastPlacedStone,
      ),
    );
  }

  /**
   * Play a move that is known to be valid. Identical to `playMove`,
   * but throws if the move is not valid.
   */
  playValidMove(move: GoMove) {
    const result = this.playMove(move);

    if (either.isLeft(result)) {
      throw new InvalidMove(result.left);
    }

    return result.right;
  }

  private validateMove(move: GoMove): MoveValidationReason | null {
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

      if (this.getCell(move.position) !== 'empty') {
        return MoveValidationReason.SpaceOccupied;
      }
    }

    return null;
  }

  get currentPlayer() {
    return otherPlayer[this.lastMove ? this.lastMove.player : 'white'];
  }

  getCell(position: BoardPosition): CellState {
    const group = this.groupCollection.get(this.getIndex(position));
    if (!group) return 'empty';

    return group.player;
  }

  private getIndex(position: BoardPosition) {
    return getIndex(this.boardSize, position);
  }
}

interface Group {
  player: GoPlayer;
  indicies: number[];
}

class GroupCollection {
  static create(boardSize: number) {
    return new GroupCollection(boardSize);
  }

  constructor(
    private readonly boardSize: number,
    private readonly groupsByIndex = Immutable.Map<number, Group>(),
  ) {}

  private up(index: number) {
    return index < this.boardSize ? null : index - this.boardSize;
  }

  private down(index: number) {
    return index + this.boardSize >= this.boardSize ** 2
      ? null
      : index + this.boardSize;
  }

  private left(index: number) {
    return index % this.boardSize === 0 ? null : index - 1;
  }

  private right(index: number) {
    return index % this.boardSize === this.boardSize - 1 ? null : index + 1;
  }

  private getAdjacentIndexes(index: number) {
    return [
      this.up(index),
      this.left(index),
      this.right(index),
      this.down(index),
    ].filter(inNonNullable);
  }

  getAdjacentGroups(index: number) {
    return uniq(
      this.getAdjacentIndexes(index)
        .map((position) => this.groupsByIndex.get(position))
        .filter(inNonNullable),
    );
  }

  addStone(player: GoPlayer, index: number): GroupCollection {
    const theirAdjacentGroups = this.getAdjacentGroups(index).filter(
      (group) => group.player === player,
    );

    const newGroup: Group = {
      player,
      indicies: [index].concat(
        ...theirAdjacentGroups.map((group) => group.indicies),
      ),
    };

    const newGroupsByIndex = newGroup.indicies.reduce(
      (groups, index) => groups.set(index, newGroup),
      this.groupsByIndex,
    );

    return new GroupCollection(this.boardSize, newGroupsByIndex);
  }

  /**
   * @returns the number of liberties or null if the group does not exist
   */
  getLibertiesOfGroup(group: Group): number {
    return group.indicies.reduce(
      (liberties, groupIndex) =>
        liberties + this.getLibertiesOfStone(groupIndex),
      0,
    );
  }

  getGroupAtIndex(index: number) {
    return this.groupsByIndex.get(index);
  }

  private getLibertiesOfStone(index: number) {
    return countWhere(
      this.getAdjacentIndexes(index),
      (adjacentIndex) => !this.groupsByIndex.has(adjacentIndex),
    );
  }

  get(index: number) {
    return this.groupsByIndex.get(index);
  }

  removeGroup(group: Group) {
    return new GroupCollection(
      this.boardSize,
      this.groupsByIndex.removeAll(group.indicies),
    );
  }
}

import {
  PuzzleSpec,
  InitialStones,
  Player,
  BoardPosition,
  PuzzleTree,
} from './Puzzle';
import {
  GameTree,
  Node,
  tryParseSgf,
  PropertyType,
  Property,
  Point,
  Color,
} from './sgf-parser';
import { chunk } from 'lodash';

interface Move {
  color: Color;
  position: BoardPosition;
}

export function loadSgf(sgf: string): PuzzleSpec {
  const trees = tryParseSgf(sgf);

  if (trees.length !== 1) throw new Error('SGF must have one gametree');

  const tree = trees[0];

  if (tree.nodes.length === 0) throw new Error('SGF has no root nodes');

  const sequences = loadGameTree(tree);
  const initialStones = getInitialStones(tree);

  return {
    initialStones,
    sequences,
  };
}

function loadGameTree(tree: GameTree): PuzzleTree[] {
  // TODO: Validate that these moves alternate between black and white
  const moves = getMoves(tree.nodes);

  const chunks = chunk(moves, 2);

  if (chunks.length === 0) {
    return tree.gameTrees.flatMap(loadGameTree);
  }

  const lastChunk = chunks.pop()!;

  let initialTree: PuzzleTree;

  if (tree.gameTrees.length === 0) {
    initialTree = {
      position: lastChunk[0].position,
      outcome: 'correct', // TODO: Work out if a branch is correct
    };

    if (lastChunk[1]) {
      initialTree.response = lastChunk[1].position;
    }
  } else {
    if (chunk.length !== 2) {
      throw new Error('No response found for non-leaf move');
    }

    initialTree = {
      position: lastChunk[0].position,
      response: lastChunk[1].position,
      children: tree.gameTrees.flatMap(loadGameTree),
    };
  }

  return [
    chunks.reduceRight<PuzzleTree>((puzzleTree, chunk) => {
      return {
        position: chunk[0].position,
        response: chunk[1].position,
        children: [puzzleTree],
      };
    }, initialTree),
  ];
}

function findKnownProperty<K extends PropertyType>(node: Node, type: K) {
  return node.properties.find(
    prop => prop.type === 'known' && prop.ident === type,
  ) as (Extract<Property, { type: 'known'; ident: K }> | undefined);
}

function expandPointComposition([upperLeft, lowerRight]: [Point, Point]) {
  const expanded: Point[] = [];

  for (let i = upperLeft[0]; i <= lowerRight[0]; i++) {
    for (let j = upperLeft[1]; j <= lowerRight[1]; j++) {
      expanded.push([i, j]);
    }
  }

  return expanded;
}

function expandCompressedPointList(list: Array<[Point, Point] | Point>) {
  return list.flatMap(point => {
    if (typeof point[0] === 'number') {
      return [point as Point];
    }

    return expandPointComposition(point as [Point, Point]);
  });
}

function getInitialStones(tree: GameTree): InitialStones {
  const [firstNode] = tree.nodes;

  const ab = findKnownProperty(firstNode, 'AB');
  const aw = findKnownProperty(firstNode, 'AW');

  const whitePoints = aw ? expandCompressedPointList(aw.value) : [];
  const blackPoints = ab ? expandCompressedPointList(ab.value) : [];

  // TODO: Work out which way round the players are

  return {
    [Player.You]: blackPoints,
    [Player.Computer]: whitePoints,
  };
}

function getMoves(nodes: Node[]): Move[] {
  const moves: Move[] = [];

  nodes.forEach(node => {
    const blackMove = findKnownProperty(node, 'B');
    const whiteMove = findKnownProperty(node, 'W');

    if (blackMove && whiteMove) {
      throw new Error('Black and white cannot both move in a single node');
    }

    if (blackMove && blackMove.value != null) {
      moves.push({ color: Color.Black, position: blackMove.value });
    }

    if (whiteMove && whiteMove.value != null) {
      moves.push({ color: Color.White, position: whiteMove.value });
    }
  });

  return moves;
}

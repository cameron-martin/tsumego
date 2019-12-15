import {
  PuzzleSpec,
  InitialStones,
  BoardPosition,
  PuzzleTree,
  Outcome,
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
  comment?: string;
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
      type: 'leaf',
      position: lastChunk[0].position,
      outcome: findOutcome(lastChunk[0], lastChunk[1]),
    };

    if (lastChunk[1]) {
      initialTree.response = lastChunk[1].position;
    }
  } else {
    if (lastChunk.length !== 2) {
      throw new Error('No response found for non-leaf move');
    }

    initialTree = {
      type: 'branch',
      position: lastChunk[0].position,
      response: lastChunk[1].position,
      children: tree.gameTrees.flatMap(loadGameTree),
    };
  }

  return [
    chunks.reduceRight<PuzzleTree>((puzzleTree, chunk) => {
      return {
        type: 'branch',
        position: chunk[0].position,
        response: chunk[1].position,
        children: [puzzleTree],
      };
    }, initialTree),
  ];
}

function findKnownProperty<K extends PropertyType>(node: Node, type: K) {
  const property = node.properties.find(
    prop => prop.type === 'known' && prop.ident === type,
  );

  if (property) {
    return property.value as Extract<
      Property,
      { type: 'known'; ident: K }
    >['value'];
  }
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

  const whitePoints = aw ? expandCompressedPointList(aw) : [];
  const blackPoints = ab ? expandCompressedPointList(ab) : [];

  // TODO: Work out which way round the players are

  return {
    you: blackPoints,
    computer: whitePoints,
  };
}

function getMoves(nodes: Node[]): Move[] {
  const moves: Move[] = [];

  nodes.forEach(node => {
    const blackMove = findKnownProperty(node, 'B');
    const whiteMove = findKnownProperty(node, 'W');
    const comment = findKnownProperty(node, 'C');

    if (blackMove && whiteMove) {
      throw new Error('Black and white cannot both move in a single node');
    }

    if (blackMove) {
      moves.push({ color: Color.Black, position: blackMove, comment });
    }

    if (whiteMove) {
      moves.push({ color: Color.White, position: whiteMove, comment });
    }
  });

  return moves;
}

function findOutcome(position: Move, response?: Move): Outcome {
  for (const move of [response, position]) {
    if (move && move.comment) {
      if (move.comment.toLowerCase().includes('wrong')) {
        return 'wrong';
      } else if (move.comment.toLowerCase().includes('correct')) {
        return 'correct';
      }
    }
  }

  throw new Error('Cannot determine outcome of branch');
}

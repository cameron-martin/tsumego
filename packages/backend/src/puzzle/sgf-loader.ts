import { PuzzleSpec, InitialStones, Player } from './Puzzle';
import {
  GameTree,
  Node,
  tryParseSgf,
  PropertyType,
  Property,
  Point,
} from './sgf-parser';

export function loadSgf(sgf: string): PuzzleSpec {
  const trees = tryParseSgf(sgf);

  if (trees.length !== 1) throw new Error('SGF must have one gametree');

  const tree = trees[0];

  if (tree.nodes.length === 0) throw new Error('SGF has no root nodes');

  const { initialStones, remainingTree } = getInitialStones(tree);

  return {
    initialStones,
    sequences: [],
  };
}

function loadGameTree(tree: GameTree) {}

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

function getInitialStones(
  tree: GameTree,
): { initialStones: InitialStones; remainingTree: GameTree } {
  const { nodes, gameTrees } = tree;

  const [firstNode, ...remainingNodes] = nodes;

  const ab = findKnownProperty(firstNode, 'AB');
  const aw = findKnownProperty(firstNode, 'AW');

  const whitePoints = aw ? expandCompressedPointList(aw.value) : [];
  const blackPoints = ab ? expandCompressedPointList(ab.value) : [];

  // TODO: Work out which way round the players are

  return {
    initialStones: {
      [Player.You]: blackPoints,
      [Player.Computer]: whitePoints,
    },
    remainingTree: {
      nodes: remainingNodes,
      gameTrees,
    },
  };
}

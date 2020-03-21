import P, { Parser } from 'parsimmon';

export enum Color {
  Black = 'B',
  White = 'W',
}

export enum Double {
  Normal = '1',
  Emphasised = '2',
}

export type Point = readonly [number, number];

const letterToNumber = (letter: string) =>
  letter.charCodeAt(0) - 'a'.charCodeAt(0);

const ucLetter = P.range('A', 'Z');
const lineBreak = P.alt(P.cr, P.lf, P.crlf, P.seq(P.lf, P.cr).tie());

const none = P.string('').result(null);
const number = P.regex(/[+-]?\d+/).map(Number.parseInt);
const real = P.regex(/[+-]?\d+(\.\d+)?/).map(Number.parseFloat);
const double = P.alt(
  P.string('1').result(Double.Normal),
  P.string('2').result(Double.Emphasised),
);
const color = P.alt(
  P.string('B').result(Color.Black),
  P.string('W').result(Color.White),
);
const text = (isComposed: boolean) =>
  P.alt(
    P.noneOf(isComposed ? ']\\:' : ']\\'),
    P.string('\\').then(lineBreak.result('').or(P.any)),
  )
    .many()
    .tie();
// TODO: Implement different rules for this.
const simpleText = text;
const point = P.range('a', 'z')
  .times(2)
  .map(([x, y]) => [letterToNumber(x), letterToNumber(y)] as const);
const stone = point;
const move = point.or(none);

const single = <T>(parser: Parser<T>) =>
  P.string('[').then(parser).skip(P.string(']'));

const listOf = <T>(parser: Parser<T>) => single(parser).sepBy1(P.optWhitespace);
const eListOf = <T>(parser: Parser<T>) =>
  single(none).result([]).or(listOf(parser));
const composed = <A, B>(
  parser1: Parser<A>,
  parser2: Parser<B>,
): Parser<[A, B]> => P.seq(parser1.skip(P.string(':')), parser2);

// Compressed point lists
const maybeComposed = <T>(parser: Parser<T>) =>
  composed(parser, parser).or(parser);
const listOfPoint = listOf(maybeComposed(point));
const eListOfPoint = eListOf(maybeComposed(point));
const listOfStone = listOf(maybeComposed(stone));
// const eListOfStone = eListOf(maybeComposed(stone));

const propertyParsers = {
  B: single(move),
  AB: listOfStone,
  AE: listOfPoint,
  AN: single(simpleText(false)),
  FF: single(number),
  AP: single(composed(simpleText(true), simpleText(true))),
  GM: single(number),
  SZ: single(composed(number, number).or(number)),
  GN: single(simpleText(false)),
  US: single(simpleText(false)),
  N: single(simpleText(false)),
  C: single(text(false)),
  W: single(move),
  GW: single(double),
  GB: single(double),
  DM: single(double),
  UC: single(double),
  TE: single(double),
  BM: single(double),
  DO: single(none),
  IT: single(none),
  AW: listOfStone,
  PL: single(color),
  TR: listOfPoint,
  MA: listOfPoint,
  CR: listOfPoint,
  SQ: listOfPoint,
  SL: listOfPoint,
  TW: eListOfPoint,
  TB: eListOfPoint,
  LB: listOf(composed(point, simpleText(true))),
  DD: eListOfPoint,
  AR: listOf(composed(point, point)),
  LN: listOf(composed(point, point)),
  BL: single(real),
  WL: single(real),
  OB: single(number),
  OW: single(number),
  MN: single(number),
  PW: single(simpleText(false)),
  WR: single(simpleText(false)),
  WT: single(simpleText(false)),
  BR: single(simpleText(false)),
  RO: single(simpleText(false)),
  RE: single(simpleText(false)),
  PB: single(simpleText(false)),
  PC: single(simpleText(false)),
  EV: single(simpleText(false)),
  KM: single(real),
  // Go-specific
  HA: single(number),
};

const unknownPropertyParser = eListOf(text(false));

export type PropertyType = keyof typeof propertyParsers;

type ExtractParserType<T extends Parser<any>> = T extends Parser<infer U>
  ? U
  : never;

type PropertyAux<U extends PropertyType> = U extends unknown
  ? {
      type: 'known';
      ident: U;
      value: ExtractParserType<typeof propertyParsers[U]>;
    }
  : never;

export type Property =
  | PropertyAux<PropertyType>
  | {
      type: 'unknown';
      unknownIdent: Exclude<string, PropertyType>;
      value: string[];
    };

const propIdent = ucLetter.atLeast(1).tie();
const property: Parser<Property> = propIdent.chain((ident) => {
  if (Object.prototype.hasOwnProperty.call(propertyParsers, ident)) {
    return (propertyParsers[ident as PropertyType] as Parser<unknown>).map(
      (value) => ({ type: 'known', ident, value } as Property),
    );
  } else {
    return unknownPropertyParser.map((value) => ({
      type: 'unknown',
      unknownIdent: ident,
      value,
    }));
  }
});

const node: Parser<Node> = P.string(';')
  .then(P.optWhitespace)
  .then(property.sepBy(P.optWhitespace))
  .map((properties) => ({ properties }));

const sequence = node.sepBy1(P.optWhitespace);

export interface Node {
  properties: Property[];
}

export interface GameTree {
  nodes: Node[];
  gameTrees: GameTree[];
}

const gameTree: Parser<GameTree> = P.lazy(() =>
  P.seqMap(
    P.string('(').then(sequence).skip(P.optWhitespace),
    gameTree.sepBy(P.optWhitespace).skip(P.string(')')).skip(P.optWhitespace),
    (nodes, gameTrees) => {
      return {
        nodes,
        gameTrees,
      };
    },
  ),
);

const collection = gameTree.sepBy1(P.optWhitespace);

const sgf = collection.skip(P.optWhitespace).skip(P.eof);

export const parseSgf = (sgfFile: string) => sgf.parse(sgfFile);

export const tryParseSgf = (sgfFile: string) => sgf.tryParse(sgfFile);

import P, { Parser } from 'parsimmon';

enum Color {
  Black = 'B',
  White = 'W',
}

enum Double {
  Normal = '1',
  Emphasised = '2',
}

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
  P.string('[')
    .then(parser)
    .skip(P.string(']'));

const listOf = <T>(parser: Parser<T>) => single(parser).sepBy1(P.optWhitespace);
const eListOf = <T>(parser: Parser<T>) =>
  single(none)
    .result([])
    .or(listOf(parser));
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
};

type PropertyType = keyof typeof propertyParsers;

type ExtractParserType<T extends Parser<any>> = T extends Parser<infer U>
  ? U
  : never;

type PropertyAux<U extends PropertyType> = U extends any
  ? { ident: U; value: ExtractParserType<typeof propertyParsers[U]> }
  : never;

type Property = PropertyAux<PropertyType>;

const propIdent = ucLetter.atLeast(1).tie();
const property = propIdent.chain(ident => {
  const parser = Object.prototype.hasOwnProperty.call(propertyParsers, ident)
    ? propertyParsers[ident as PropertyType]
    : undefined;

  if (!parser) return P.fail(`Unknown property type ${ident}`);

  return (parser as Parser<any>).map(value => ({ ident, value } as Property));
});

const node = P.string(';')
  .then(P.optWhitespace)
  .then(property.sepBy(P.optWhitespace));
const sequence = node.sepBy1(P.optWhitespace);

interface GameTree {
  sequence: Property[][];
  gameTrees: GameTree[];
}

const gameTree: Parser<GameTree> = P.lazy(() =>
  P.seqMap(
    P.string('(')
      .then(sequence)
      .skip(P.optWhitespace),
    gameTree
      .sepBy(P.optWhitespace)
      .skip(P.string(')'))
      .skip(P.optWhitespace),
    (sequence, gameTrees) => {
      return {
        sequence,
        gameTrees,
      };
    },
  ),
);

const collection = gameTree.sepBy1(P.optWhitespace);

export const parseSgf = (sgf: string) =>
  collection
    .skip(P.optWhitespace)
    .skip(P.eof)
    .parse(sgf);

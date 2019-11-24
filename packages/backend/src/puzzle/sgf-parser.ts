import Parsimmon, { Parser } from 'parsimmon';

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

const ucLetter = Parsimmon.range('A', 'Z');
const lineBreak = Parsimmon.alt(
  Parsimmon.cr,
  Parsimmon.lf,
  Parsimmon.crlf,
  Parsimmon.seq(Parsimmon.lf, Parsimmon.cr).tie(),
);

const none = Parsimmon.string('').result(null);
const number = Parsimmon.regex(/[+-]?\d+/).map(Number.parseInt);
const real = Parsimmon.regex(/[+-]?\d+(\.\d+)?/).map(Number.parseFloat);
const double = Parsimmon.alt(
  Parsimmon.string('1').result(Double.Normal),
  Parsimmon.string('2').result(Double.Emphasised),
);
const color = Parsimmon.alt(
  Parsimmon.string('B').result(Color.Black),
  Parsimmon.string('W').result(Color.White),
);
const text = (isComposed: boolean) =>
  Parsimmon.alt(
    Parsimmon.noneOf(isComposed ? ']\\:' : ']\\'),
    Parsimmon.string('\\').then(lineBreak.result('').or(Parsimmon.any)),
  )
    .many()
    .tie();
// TODO: Implement different rules for this.
const simpleText = text;
const point = Parsimmon.range('a', 'z')
  .times(2)
  .map(([x, y]) => [letterToNumber(x), letterToNumber(y)] as const);
const stone = point;
const move = point.or(none);

const single = <T>(parser: Parser<T>) =>
  Parsimmon.string('[')
    .then(parser)
    .skip(Parsimmon.string(']'));

const listOf = <T>(parser: Parser<T>) =>
  single(parser).sepBy1(Parsimmon.optWhitespace);
const eListOf = <T>(parser: Parser<T>) =>
  single(none)
    .result([])
    .or(listOf(parser));
const composed = <A, B>(
  parser1: Parser<A>,
  parser2: Parser<B>,
): Parser<[A, B]> =>
  Parsimmon.seq(parser1.skip(Parsimmon.string(':')), parser2);

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

  if (!parser) return Parsimmon.fail(`Unknown property type ${ident}`);

  return (parser as Parser<any>).map(value => ({ ident, value } as Property));
});

const node = Parsimmon.string(';')
  .then(Parsimmon.optWhitespace)
  .then(property.sepBy(Parsimmon.optWhitespace));
const sequence = node.sepBy1(Parsimmon.optWhitespace);

interface GameTree {
  sequence: Property[][];
  gameTrees: GameTree[];
}

const gameTree: Parser<GameTree> = Parsimmon.lazy(() =>
  Parsimmon.seqMap(
    Parsimmon.string('(')
      .then(sequence)
      .skip(Parsimmon.optWhitespace),
    gameTree
      .sepBy(Parsimmon.optWhitespace)
      .skip(Parsimmon.string(')'))
      .skip(Parsimmon.optWhitespace),
    (sequence, gameTrees) => {
      return {
        sequence,
        gameTrees,
      };
    },
  ),
);

const collection = gameTree.sepBy1(Parsimmon.optWhitespace);

export const parseSgf = (sgf: string) =>
  collection
    .skip(Parsimmon.optWhitespace)
    .skip(Parsimmon.eof)
    .parse(sgf);

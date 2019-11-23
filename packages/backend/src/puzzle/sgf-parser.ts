import Parsimmon from 'parsimmon';

// Collection = GameTree { GameTree }
// GameTree   = "(" Sequence { GameTree } ")"
// Sequence   = Node { Node }
// Node       = ";" { Property }
// Property   = PropIdent PropValue { PropValue }
// PropIdent  = UcLetter { UcLetter }
// PropValue  = "[" CValueType "]"
// CValueType = (ValueType | Compose)
// ValueType  = (None | Number | Real | Double | Color | SimpleText |
//   Text | Point  | Move | Stone)

// UcLetter   = "A".."Z"
// Digit      = "0".."9"
// None       = ""

// Number     = [("+"|"-")] Digit { Digit }
// Real       = Number ["." Digit { Digit }]

// Double     = ("1" | "2")
// Color      = ("B" | "W")

// SimpleText = { any character (handling see below) }
// Text       = { any character (handling see below) }

// Point      = game-specific
// Move       = game-specific
// Stone      = game-specific

// Compose    = ValueType ":" ValueType

enum Color {
  Black = 'B',
  White = 'W',
}

enum Double {
  Normal = '1',
  Emphasised = '2',
}

const ucLetter = Parsimmon.range('A', 'Z');

const none = Parsimmon.string('');
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
const text = Parsimmon.alt(
  Parsimmon.noneOf(']\\:'),
  Parsimmon.string('\\').then(Parsimmon.oneOf(']\\:')),
);

const propertyTypes = {
  B: move,
};

type Property =

const valueType = Parsimmon.alt(
  none,
  number,
  real,
  double,
  color,
  simpleText,
  text,
  point,
  move,
  stone,
);
const cValueType = valueType.sepBy(Parsimmon.string(':'));

const propValue = Parsimmon.string('[')
  .then(cValueType)
  .skip(Parsimmon.string(']'));
const propIdent = ucLetter.atLeast(1).tie();
const property = Parsimmon.seqObj<Property>(
  ['ident', propIdent],
  ['value', propValue.atLeast(1)],
);

const node = Parsimmon.string(';').then(property.many());
const sequence = node.atLeast(1);

const gameTree = Parsimmon.lazy(() =>
  Parsimmon.seqMap(
    Parsimmon.string('(').then(sequence),
    gameTree.many().skip(Parsimmon.string(')')),
    (sequence, gameTrees) => {
      return {
        sequence,
        gameTrees,
      };
    },
  ),
);

const collection = gameTree.atLeast(1);

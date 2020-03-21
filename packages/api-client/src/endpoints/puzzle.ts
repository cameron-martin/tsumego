import { Requester } from '../requester';

type BoardPosition = readonly [number, number];

interface GetPuzzleResponse {
  id: string;
  initialStones: {
    you: BoardPosition[];
    computer: BoardPosition[];
  };
  area: {
    min: BoardPosition;
    max: BoardPosition;
  };
}

type SolvePuzzleResponse =
  | { type: 'wrong'; response?: BoardPosition }
  | { type: 'correct' }
  | { type: 'continue'; response: BoardPosition };

export class PuzzleApiClient {
  constructor(private readonly requester: Requester) {}

  getRandom(): Promise<GetPuzzleResponse> {
    return this.requester.request('GET', `/puzzle/random`);
  }

  get(id: string): Promise<GetPuzzleResponse> {
    return this.requester.request('GET', `/puzzle/${id}`);
  }

  solve(
    id: string,
    solution: readonly BoardPosition[],
  ): Promise<SolvePuzzleResponse> {
    return this.requester.request('POST', `/puzzle/${id}/solution`, solution);
  }

  /**
   * Creates a puzzle from an sgf file.
   */
  async create(puzzle: File): Promise<void> {
    return this.requester.request('POST', `/puzzle`, {
      type: 'sgf',
      file: await readFile(puzzle),
    });
  }
}

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target!.result);
    };

    reader.onerror = (event) => {
      reject(event.target!.error);
    };

    reader.readAsText(file);
  });
}

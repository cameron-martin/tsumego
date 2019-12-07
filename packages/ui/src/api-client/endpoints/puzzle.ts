import { Requester } from '../requester';

type BoardPosition = readonly [number, number];

interface GetPuzzleResponse {
  id: string;
  initialStones: {
    you: BoardPosition[];
    computer: BoardPosition[];
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
}

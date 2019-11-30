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

class Requester {
  constructor(private readonly host: string) {}

  async request(method: 'POST' | 'GET', path: string, body?: unknown) {
    const response = await fetch(this.host + path, {
      method,
      body: body && JSON.stringify(body),
      headers: body && {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Got bad status code: ' + response.status);
    }

    return response.json();
  }
}

export class PuzzleApiClient {
  private readonly requester = new Requester(this.host);
  constructor(private readonly host: string) {}

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

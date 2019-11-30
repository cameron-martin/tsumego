import { PuzzleApiClient } from './puzzle';

export class ApiClient {
  puzzle = new PuzzleApiClient(this.host);
  constructor(private readonly host: string) {}
}

import { PuzzleApiClient } from './endpoints/puzzle';
import { Requester, Middleware, Handler } from './requester';

export interface Config {
  host: string;
  middleware?: Middleware[];
}

export class ApiClient {
  private readonly requester = new Requester(
    this.config.host,
    this.config.middleware || [],
  );
  readonly puzzle = new PuzzleApiClient(this.requester);
  constructor(private readonly config: Config) {}
}

export { Middleware, Handler };

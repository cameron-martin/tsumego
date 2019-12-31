import { Requester, Middleware, Handler } from './requester';
import { PuzzleApiClient } from './endpoints/puzzle';
import { UserRatingsApiClient } from './endpoints/user-ratings';

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
  readonly userRatings = new UserRatingsApiClient(this.requester);
  constructor(private readonly config: Config) {}
}

export { Middleware, Handler };

export { UserRating } from './endpoints/user-ratings';

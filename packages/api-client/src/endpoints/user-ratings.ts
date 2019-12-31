import { Requester } from '../requester';

export interface UserRating {
  id: number;
  userId: string;
  mean: number;
  deviation: number;
}

export class UserRatingsApiClient {
  constructor(private readonly requester: Requester) {}

  getAll(): Promise<UserRating[]> {
    return this.requester.request('GET', `/user-ratings`);
  }
}

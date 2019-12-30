import {
  Rating,
  FULL_DECAY_SECONDS,
  MAX_DEVIATION,
  MIN_DEVIATION,
} from './Rating';

describe('applyGames', () => {
  test('glicko paper example', () => {
    const myRating = new Rating({
      mean: 1500,
      deviation: 200,
      ratedAt: new Date(),
    });

    const myNewRating = myRating.applyGames([
      {
        won: true,
        opponentRating: new Rating({
          mean: 1400,
          deviation: 30,
          ratedAt: new Date(),
        }),
      },
      {
        won: false,
        opponentRating: new Rating({
          mean: 1550,
          deviation: 100,
          ratedAt: new Date(),
        }),
      },
      {
        won: false,
        opponentRating: new Rating({
          mean: 1700,
          deviation: 300,
          ratedAt: new Date(),
        }),
      },
    ]);

    expect(myNewRating.mean).toBeCloseTo(1464.1, 1);
    expect(myNewRating.deviation).toBeCloseTo(151.4, 1);
    expect(myNewRating.ratedAt.getTime()).toBe(myRating.ratedAt.getTime());
  });

  test('rating deviation cannot get too low', () => {
    const myRating = new Rating({
      mean: 1500,
      deviation: 30,
      ratedAt: new Date(),
    });

    const myNewRating = myRating.applyGames([
      {
        won: true,
        opponentRating: new Rating({
          mean: 1500,
          deviation: 30,
          ratedAt: new Date(),
        }),
      },
    ]);

    expect(myNewRating.deviation).toBe(MIN_DEVIATION);
  });
});

describe('decay', () => {
  test('it fully decays after full decay time', () => {
    const myRating = new Rating({
      mean: 1500,
      deviation: MIN_DEVIATION,
      ratedAt: new Date(),
    });

    const to = new Date(myRating.ratedAt.getTime() + FULL_DECAY_SECONDS * 1000);

    const newRating = myRating.decay(to);

    expect(newRating.deviation).toBe(MAX_DEVIATION);
  });

  test(`it doesn't fully decay when the decay period is nearly over`, () => {
    const myRating = new Rating({
      mean: 1500,
      deviation: MIN_DEVIATION,
      ratedAt: new Date(),
    });

    const to = new Date(
      myRating.ratedAt.getTime() + FULL_DECAY_SECONDS * 0.9 * 1000,
    );

    const newRating = myRating.decay(to);

    expect(newRating.deviation).toBeLessThan(MAX_DEVIATION);
  });

  test(`it doesn't decay at all in 0 time`, () => {
    const myRating = new Rating({
      mean: 1500,
      deviation: 200,
      ratedAt: new Date(),
    });

    const newRating = myRating.decay(myRating.ratedAt);

    expect(newRating.deviation).toBe(myRating.deviation);
  });
});

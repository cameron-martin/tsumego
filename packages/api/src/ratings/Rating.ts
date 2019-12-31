import { sumBy } from 'lodash';

export interface RatingSpec {
  ratedAt: Date;
  mean: number;
  deviation: number;
}

export const MIN_DEVIATION = 30;
export const MAX_DEVIATION = 350;

/**
 * The number of seconds to decay from min to max deviation
 */
export const FULL_DECAY_SECONDS = 6.307e7; // 2 years

const DECAY_FACTOR =
  (MAX_DEVIATION ** 2 - MIN_DEVIATION ** 2) / FULL_DECAY_SECONDS;

const q = Math.log(10) / 400;

export class Rating {
  public readonly ratedAt: Date;
  public readonly mean: number;
  public readonly deviation: number;

  static default(ratedAt: Date) {
    return new Rating({
      deviation: MAX_DEVIATION,
      mean: 1500,
      ratedAt,
    });
  }

  constructor(spec: RatingSpec) {
    this.ratedAt = spec.ratedAt;
    this.mean = spec.mean;
    this.deviation = spec.deviation;
  }

  decay(to: Date) {
    const decayedForSeconds = (to.getTime() - this.ratedAt.getTime()) / 1000;

    const newDeviation = Math.min(
      Math.sqrt(this.deviation ** 2 + DECAY_FACTOR * decayedForSeconds),
      MAX_DEVIATION,
    );

    return new Rating({
      deviation: newDeviation,
      mean: this.mean,
      ratedAt: to,
    });
  }

  get currentRating() {
    return this.decay(new Date());
  }

  applyGames(games: { won: boolean; opponentRating: Rating }[]): Rating {
    const dSquared =
      1 /
      (q ** 2 *
        sumBy(games, game => {
          const grdj = g(game.opponentRating.deviation);
          const ev = getEv(grdj, this.mean, game.opponentRating.mean);

          return grdj ** 2 * ev * (1 - ev);
        }));

    const newMean =
      this.mean +
      (q / (1 / this.deviation ** 2 + 1 / dSquared)) *
        sumBy(games, game => {
          const grdj = g(game.opponentRating.deviation);
          const ev = getEv(grdj, this.mean, game.opponentRating.mean);

          return grdj * (Number(game.won) - ev);
        });

    const newDeviation = Math.max(
      MIN_DEVIATION,
      Math.sqrt(1 / (1 / this.deviation ** 2 + 1 / dSquared)),
    );

    return new Rating({
      mean: newMean,
      deviation: newDeviation,
      ratedAt: this.ratedAt,
    });
  }
}

function g(deviation: number) {
  return 1 / Math.sqrt(1 + (3 * q ** 2 * deviation ** 2) / Math.PI ** 2);
}

function getEv(grd: number, myMean: number, hisMean: number) {
  return 1 / (1 + 10 ** ((-grd * (myMean - hisMean)) / 400));
}

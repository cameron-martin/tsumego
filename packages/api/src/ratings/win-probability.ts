import { jStat } from 'jstat';

const mean = 0.8;
const variance = 0.1;

export function sampleWinProbability() {
  const alpha = mean * ((mean * (1 - mean)) / variance - 1);
  const beta = (1 - mean) * ((mean * (1 - mean)) / variance - 1);

  return jStat.beta.sample(alpha, beta);
}

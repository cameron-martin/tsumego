import { parseSgf } from '../sgf-parser';
import { promises as fs } from 'fs';
import path from 'path';

test('snapshot example sgf file', async () => {
  const sgf = await fs.readFile(
    path.join(__dirname, 'sgfs', 'ff4_ex.sgf'),
    'utf8',
  );

  expect(parseSgf(sgf)).toMatchSnapshot();
});

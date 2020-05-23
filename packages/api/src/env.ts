/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({
    path: path.join(__dirname, '..', '..', '..', '.env'),
  });
}

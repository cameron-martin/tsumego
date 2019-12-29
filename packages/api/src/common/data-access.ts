import { Pool, PoolClient } from 'pg';

export async function withClient<T>(
  pool: Pool,
  block: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    return await block(client);
  } finally {
    client.release();
  }
}

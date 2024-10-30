import client from './database';

export async function cleanupDatabase(): Promise<void> {
  try {
    await client.query('BEGIN');
    await client.query(
      'TRUNCATE TABLE ordered_products, orders, products, users RESTART IDENTITY CASCADE'
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

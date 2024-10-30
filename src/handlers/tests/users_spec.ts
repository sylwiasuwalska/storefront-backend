import request from 'supertest';
import app from '../../server';
import { Secret } from 'jsonwebtoken';
import { cleanupDatabase } from '../../cleanupDatabase';

describe('Users Endpoint', () => {
  let token: Secret;

  beforeAll(async () => {
    const response = await request(app).post('/users').send({
      firstName: 'Lilla',
      lastName: 'Purple',
      password: 'password',
    });
    token = response.body.token;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('create method returns token', async () => {
    const response = await request(app).post('/users').send({
      firstName: 'Rose',
      lastName: 'Green',
      password: 'password',
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeInstanceOf(String);
  });

  it('returns product with get method when id is given', async () => {
    const response = await request(app)
      .get('/users/1')
      .set({ authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      first_name: 'Lilla',
      last_name: 'Purple',
    });
  });

  it('returns list of products with get method', async () => {
    const response = await request(app)
      .get('/users')
      .set({ authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        first_name: 'Lilla',
        last_name: 'Purple',
      },
      {
        id: 2,
        first_name: 'Rose',
        last_name: 'Green',
      },
    ]);
  });
});

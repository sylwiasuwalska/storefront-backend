import request from 'supertest';
import app from '../../server';
import { cleanupDatabase } from '../../cleanupDatabase';
import { Secret } from 'jsonwebtoken';

describe('products Endpoint', () => {
  let token: Secret;

  beforeAll(async () => {
    const userResponse = await request(app).post('/users').send({
      firstName: 'Lilla',
      lastName: 'Purple',
      password: 'password',
    });
    token = userResponse.body.token;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('adds new product with post method', async () => {
    const response = await request(app)
      .post('/products')
      .set({ authorization: `Bearer ${token}` })
      .send({ name: 'flower shampoo', price: 20, category: 'cosmetics' });

    expect(response.body).toEqual({
      id: 1,
      name: 'flower shampoo',
      price: 20,
      category: 'cosmetics',
    });
  });

  it('returns list of products with get method', async () => {
    const response = await request(app).get('/products');

    expect(response.body).toEqual([
      {
        id: 1,
        name: 'flower shampoo',
        price: 20,
        category: 'cosmetics',
      },
    ]);
  });

  it('returns product with get method when id is given', async () => {
    const response = await request(app).get('/products/1');

    expect(response.body).toEqual({
      id: 1,
      name: 'flower shampoo',
      price: 20,
      category: 'cosmetics',
    });
  });
});

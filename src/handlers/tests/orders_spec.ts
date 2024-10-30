import request from 'supertest';
import app from '../../server';
import { cleanupDatabase } from '../../cleanupDatabase';
import { Secret } from 'jsonwebtoken';

const mockedProduct = {
  name: 'flower shampoo',
  price: 20,
  category: 'cosmetics',
};

describe('Orders Endpoint', () => {
  let token: Secret;
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    //adding user
    const userResponse = await request(app).post('/users').send({
      firstName: 'Lilla',
      lastName: 'Purple',
      password: 'password',
    });
    token = userResponse.body.token;
    userId = userResponse.body.user_id;

    //adding product
    const productResponse = await request(app)
      .post('/products')
      .set({ authorization: `Bearer ${token}` })
      .send(mockedProduct);

    productId = productResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('adds new order with post method', async () => {
    const response = await request(app)
      .post('/orders')
      .set({ authorization: `Bearer ${token}` })
      .send({
        user_id: userId,
        status: 'active',
        products: [
          {
            quantity: 20,
            product_id: productId,
          },
        ],
      });

    expect(response.body).toEqual({
      id: 1,
      user_id: userId,
      status: 'active',
      products: [
        {
          quantity: 20,
          product_id: productId,
        },
      ],
    });
  });

  it('returns current order for user_id', async () => {
    const response = await request(app)
      .get(`/orders/current/${userId}`)
      .set({ authorization: `Bearer ${token}` });

    expect(response.body).toEqual({
      id: 1,
      user_id: userId,
      status: 'active',
      products: [
        {
          quantity: 20,
          product_id: productId,
        },
      ],
    });
  });
});

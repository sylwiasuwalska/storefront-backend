import { Order, OrderStore } from '../orders';

const store = new OrderStore();

const orderMock: Omit<Order, 'id'> = {
  user_id: 1,
  status: 'in_progress',
  products: [
    {
      quantity: 20,
      product_id: 200,
    },
  ],
};

describe('Order Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a order', async () => {
    const result = await store.create(orderMock);
    expect(result).toEqual({
      id: 1,
      ...orderMock,
    });
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        ...orderMock,
      },
    ]);
  });

  it('show method should return the correct order', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      ...orderMock,
    });
  });
});

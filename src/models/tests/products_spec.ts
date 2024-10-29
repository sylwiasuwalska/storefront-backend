import { Product, ProductStore } from '../products';

const store = new ProductStore();

const productMock: Omit<Product, 'id'> = {
  name: 'Flower Shampoo',
  price: 20,
  category: 'cosmetics',
};

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create(productMock);
    expect(result).toEqual({
      id: 1,
      ...productMock,
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        ...productMock,
      },
    ]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      ...productMock,
    });
  });
});

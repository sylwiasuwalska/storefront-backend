import { cleanupDatabase } from '../../cleanupDatabase';
import { Product, ProductStore } from '../products';

const store = new ProductStore();

describe('Product Model', () => {
  afterAll(async () => {
    await cleanupDatabase();
  });

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
    const productMock: Omit<Product, 'id'> = {
      name: 'flower shampoo',
      price: 20,
      category: 'cosmetics',
    };
    const result = await store.create(productMock);
    expect(result).toEqual({
      id: result.id,
      ...productMock,
    });
  });

  it('show method should return the correct product', async () => {
    const productMock: Omit<Product, 'id'> = {
      name: 'tooth paste',
      price: 11,
      category: 'cosmetics',
    };
    const createdProduct = await store.create(productMock);
    const result = await store.show(createdProduct.id!);
    expect(result).toEqual({
      id: createdProduct.id,
      ...productMock,
    });
  });

  it('index method should return a list of products', async () => {
    const pear: Omit<Product, 'id'> = {
      name: 'pear',
      price: 15,
      category: 'fruits',
    };
    const createdPear = await store.create(pear);
    const tomato: Omit<Product, 'id'> = {
      name: 'tomato',
      price: 30,
      category: 'vegetables',
    };
    const createdTomato = await store.create(tomato);
    const result = await store.index();
    expect(result).toContain({
      id: createdPear.id,
      ...pear,
    });
    expect(result).toContain({
      id: createdTomato.id,
      ...tomato,
    });
  });
});

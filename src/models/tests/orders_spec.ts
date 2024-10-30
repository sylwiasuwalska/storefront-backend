import { Order, OrderStore } from '../orders';
import { Product, ProductStore } from '../products';
import { User, UserStore } from '../users';

const store = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();

describe('Order Model', () => {
  it('should have a showCurrent method', () => {
    expect(store.showCurrent).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add an order', async () => {
    const user: User = {
      first_name: 'John',
      last_name: 'Smith',
      password: 'test123',
    };
    const createdUser = await userStore.create(user);
    const product: Product = {
      name: 'milk',
      price: 120,
      category: 'dairy',
    };
    const createdProduct = await productStore.create(product);
    const order: Omit<Order, 'id'> = {
      user_id: createdUser.id!,
      status: 'active',
      products: [
        {
          quantity: 20,
          product_id: createdProduct.id!,
        },
      ],
    };
    const createdOrder = await store.create(order);
    expect(createdOrder).toEqual({
      id: createdOrder.id!,
      ...order,
    });
  });

  it('showCurrent method should return the correct order for user_id', async () => {
    const user: User = {
      first_name: 'Mike',
      last_name: 'Green',
      password: 'test123',
    };
    const createdUser = await userStore.create(user);
    const product: Product = {
      name: 'apple',
      price: 50,
      category: 'fruits',
    };
    const createdProduct = await productStore.create(product);
    const order: Omit<Order, 'id'> = {
      user_id: createdUser.id!,
      status: 'active',
      products: [
        {
          quantity: 5,
          product_id: createdProduct.id!,
        },
      ],
    };
    const createdOrder = await store.create(order);
    const result = await store.showCurrent(createdOrder.user_id);
    expect(result).toEqual({
      id: createdOrder.id,
      ...createdOrder,
    });
  });
});

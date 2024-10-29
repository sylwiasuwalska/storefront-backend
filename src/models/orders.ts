import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  products: Array<{ product_id: number; quantity: number }>;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const connection = await Client.connect();

      const sqlOrders = 'SELECT * FROM orders';
      const sqlProducts =
        'SELECT order_id, product_id, quantity FROM ordered_products';

      const ordersResult = await connection.query<Order>(sqlOrders);
      const productsResult = await connection.query<{
        order_id: number;
        product_id: number;
        quantity: number;
      }>(sqlProducts);

      connection.release();

      const orders = ordersResult.rows;
      const products = productsResult.rows;

      const orderMap: {
        [key: number]: Array<{ product_id: number; quantity: number }>;
      } = {};

      products.forEach((product) => {
        if (!orderMap[product.order_id]) {
          orderMap[product.order_id] = [];
        }
        orderMap[product.order_id].push({
          product_id: product.product_id,
          quantity: product.quantity,
        });
      });

      orders.forEach((order) => {
        order.products = order.id ? orderMap[order.id] : [];
      });

      return orders;
    } catch (error) {
      throw new Error(`Cannot get orders: ${error}.`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sqlOrder = 'SELECT * FROM orders WHERE id = $1';
      const sqlProducts =
        'SELECT product_id, quantity FROM ordered_products WHERE order_id = $1';

      const connection = await Client.connect();

      const orderResult = await connection.query<Order>(sqlOrder, [id]);
      const productsResult = await connection.query<{
        product_id: number;
        quantity: number;
      }>(sqlProducts, [id]);

      connection.release();

      if (orderResult.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }

      const order = orderResult.rows[0];
      order.products = productsResult.rows;

      return order;
    } catch (err) {
      throw new Error(`Could not find Order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sqlOrder =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';

      const connection = await Client.connect();

      const result = await connection.query<{
        id: number;
        status: string;
        user_id: number;
      }>(sqlOrder, [order.user_id, order.status]);

      const createdOrderId = result.rows[0].id;
      const userId = result.rows[0].user_id;
      const status = result.rows[0].status;

      const insertedProducts = [];

      for (const product of order.products) {
        const sqlOrderedProducts =
          'INSERT INTO ordered_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';

        const productResult = await connection.query<{
          product_id: number;
          quantity: number;
        }>(sqlOrderedProducts, [
          createdOrderId,
          product.product_id,
          product.quantity,
        ]);

        insertedProducts.push(productResult.rows[0]);
      }

      connection.release();

      return {
        id: createdOrderId,
        user_id: userId,
        status: status,
        products: insertedProducts,
      };
    } catch (err) {
      throw new Error(`Could not create order: ${err}`);
    }
  }
}

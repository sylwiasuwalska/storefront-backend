import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  products: Array<{ product_id: number; quantity: number }>;
};

export class OrderStore {
  async showCurrent(user_id: number): Promise<Order> {
    try {
      const sqlOrder =
        "SELECT * FROM orders WHERE user_id = $1 AND status = 'active' LIMIT 1";
      const sqlProducts =
        'SELECT product_id, quantity FROM ordered_products WHERE order_id = $1';

      const connection = await Client.connect();

      const orderResult = await connection.query<Omit<Order, 'products'>>(
        sqlOrder,
        [user_id]
      );
      if (orderResult.rows.length === 0) {
        connection.release();
        throw new Error(`Order with user_id ${user_id} not found`);
      }
      const order = orderResult.rows[0];

      const productsResult = await connection.query<{
        product_id: number;
        quantity: number;
      }>(sqlProducts, [order.id]);

      connection.release();

      const products = productsResult.rows;

      return { ...order, products };
    } catch (err) {
      throw new Error(`Could not find Order ${user_id}. Error: ${err}`);
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

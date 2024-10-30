import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import verifyAuthToken from '../middlewares/authMiddleware';

const store = new OrderStore();

const showCurrent = async (req: Request, res: Response) => {
  try {
    const order = await store.showCurrent(Number(req.params.user_id));
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status,
      products: req.body.products,
    };

    if (order.status != 'active' && order.status != 'complete') {
      throw new Error(`Invalid status`);
    }

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders/current/:user_id', verifyAuthToken, showCurrent);
  app.post('/orders', verifyAuthToken, create);
};

export default orderRoutes;

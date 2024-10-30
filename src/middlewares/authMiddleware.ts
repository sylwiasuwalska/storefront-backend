import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json('Access denied, token not provided');
    }

    const token = authorizationHeader.split(' ')[1];
    const secret = process.env.TOKEN!;

    const decoded = jwt.verify(token, secret as Secret);

    next();
  } catch (error) {
    res.status(401).json('Access denied, invalid token');
  }
};

export default verifyAuthToken;

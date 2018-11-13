import { NextFunction, Request, Response } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth || !auth) return next(); // TO DO
  return res.status(401).send('You shall not pass!');
};

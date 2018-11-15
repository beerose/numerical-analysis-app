import { Request, Response } from 'express';

export const loginUser = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send({ token: 'token', user_name: 'username', user_role: 'admin' });
};

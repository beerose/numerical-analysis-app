import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { findUserWithPasswordQuery } from '../store/queries';

interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
export const loginUser = (req: LoginUserRequest, res: Response) => {
  const { email, password } = req.body;
  connection.query(
    {
      sql: findUserWithPasswordQuery,
      values: [email, password],
    },
    (err, result) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!result.length) {
        return res.status(codes.UNAUTHORIZED).send({ error: apiMessages.invalidEmailOrPassword });
      }
      return res
        .status(200)
        .send({ token: 'token', user_name: result[0].user_name, user_role: result[0].user_role });
    }
  );
};

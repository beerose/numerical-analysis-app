import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { findUserWithPasswordQuery } from '../store/queries';

import { generateToken } from './utils';

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
    (err, result: UserDTO[]) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!result.length) {
        return res.status(codes.UNAUTHORIZED).send({ error: apiMessages.invalidEmailOrPassword });
      }

      const { user_name, user_role } = result[0];
      const token = generateToken(email, user_name);

      return res.status(200).send({ token, user_name, user_role });
    }
  );
};

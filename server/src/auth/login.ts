import { compare as comparePassword } from 'bcrypt';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { getWholeUserByEmailQuery } from '../store/queries';

import { generateToken } from './utils';

interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
export const loginUser = (req: LoginUserRequest, res: Response) => {
  const { email, password } = req.body;

  type UserWithPassword = UserDTO & {
    password: string;
  };

  connection.query(
    {
      sql: getWholeUserByEmailQuery,
      values: [email],
    },
    (err, result: UserWithPassword[]) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!result.length) {
        return res.status(codes.UNAUTHORIZED).send({
          error: apiMessages.userNotFound,
        });
      }

      const { user_name, user_role, password: hashedPassword } = result[0];

      return comparePassword(password, hashedPassword, (comparisonError, comparisonResult) => {
        if (comparisonError) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        }
        if (!comparisonResult) {
          return res.status(codes.UNAUTHORIZED).send({ error: apiMessages.invalidEmailOrPassword });
        }

        const token = generateToken(email, user_name);

        return res.status(codes.OK).send({ token, user_name, user_role });
      });
    }
  );
};

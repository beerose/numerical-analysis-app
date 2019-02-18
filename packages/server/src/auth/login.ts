import { compare as comparePassword } from 'bcrypt';
import { apiMessages, UserDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
import { BackendResponse } from '../lib/response';
import { db } from '../store';

import { generateToken } from './utils';

const LoginUserBodyV = t.type({
  email: t.string,
  password: t.string,
});

type LoginUserRequest = GetRequest<typeof LoginUserBodyV>;

export const loginUser = (
  req: LoginUserRequest,
  res: BackendResponse<{ token: string; user_name: string; user_role: string }>
) => {
  handleBadRequest(LoginUserBodyV, req.body, res).then(() => {
    const { email, password } = req.body;

    type UserWithPassword = UserDTO & {
      password: string;
    };

    db.findUserByEmail({ email }, (err, result: UserWithPassword | null) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          errorDetails: err.message,
        });
      }
      if (!result) {
        return res.status(codes.UNAUTHORIZED).send({
          error: apiMessages.userNotFound,
        });
      }

      const { user_name, user_role, password: hashedPassword } = result;

      return comparePassword(
        password,
        hashedPassword,
        (comparisonError, comparisonResult) => {
          if (comparisonError) {
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
          }
          if (!comparisonResult) {
            return res
              .status(codes.UNAUTHORIZED)
              .send({ error: apiMessages.invalidEmailOrPassword });
          }

          const token = generateToken(email, user_name, user_role);

          return res.status(codes.OK).send({ token, user_name, user_role });
        }
      );
    });
  });
};

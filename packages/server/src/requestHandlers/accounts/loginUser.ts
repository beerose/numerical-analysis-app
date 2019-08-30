import { compare as comparePassword } from 'bcrypt';
import { apiMessages, UserDTO, UserPrivileges } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import {
  BackendResponse,
  generateUserJwtToken,
  handleBadRequest,
} from '../../lib';
import { db } from '../../store';

const LoginUserBodyV = t.type({
  email: t.string,
  password: t.string,
});

export const loginUser = (
  req: Request,
  res: BackendResponse<{
    token: string;
    user: UserDTO;
    privileges?: UserPrivileges;
  }>
) => {
  handleBadRequest(LoginUserBodyV, req.body, res).then(
    ({ email, password }) => {
      type UserWithPassword = UserDTO & {
        password: string;
      };

      db.findUserByEmail({ email }, (err, result: UserWithPassword | null) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        if (!result) {
          return res.status(codes.UNAUTHORIZED).send({
            error: apiMessages.userNotFound,
          });
        }

        const {
          user_name,
          user_role,
          password: hashedPassword,
          privileges,
        } = result;

        return comparePassword(
          password,
          hashedPassword,
          (comparisonError, comparisonResult) => {
            if (comparisonError) {
              return res.internalError(comparisonError);
            }
            if (!comparisonResult) {
              return res
                .status(codes.UNAUTHORIZED)
                .send({ error: apiMessages.invalidEmailOrPassword });
            }

            const token = generateUserJwtToken({
              email,
              user_name,
              user_role,
            });

            delete result.password;

            return res
              .status(codes.OK)
              .send({ token, privileges, user: result });
          }
        );
      });
    }
  );
};

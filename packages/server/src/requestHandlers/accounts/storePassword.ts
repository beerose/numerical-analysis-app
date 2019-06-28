import { hash } from 'bcrypt';
import { apiMessages, ApiResponse, UserDTO } from 'common';
import * as codes from 'http-status-codes';

import { db } from '../../store';
const SALT_ROUNDS = 10;

export const storePassword = (
  password: string,
  user: Pick<UserDTO, 'email'>,
  callback: (
    result:
      | {
          code: number;
        }
      | {
          code: number;
          error: string;
          error_details?: string;
        }
  ) => void
) => {
  hash(password, SALT_ROUNDS, (hashingError, passwordHash) => {
    if (hashingError) {
      return callback({
        code: codes.INTERNAL_SERVER_ERROR,
        error: apiMessages.internalError,
        error_details: hashingError.message,
      });
    }

    return db.setUserPassword(
      { passwordHash, email: user.email },
      (error, results) => {
        if (error) {
          return callback({
            code: codes.INTERNAL_SERVER_ERROR,
            error: apiMessages.internalError,
            error_details: error.message,
          });
        }
        if (!results.affectedRows) {
          return callback({
            code: codes.NOT_FOUND,
            error: apiMessages.userNotFound,
          });
        }
        return callback({
          code: codes.OK,
        });
      }
    );
  });
};

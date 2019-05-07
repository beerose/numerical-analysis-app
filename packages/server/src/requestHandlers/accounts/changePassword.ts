import { compare as comparePassword } from 'bcrypt';
import { apiMessages, UserDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';

import { storePassword } from './storePassword';

const ChangePasswordBodyV = t.type({
  new_password: t.string,
});

type ChangePasswordRequest = GetRequest<typeof ChangePasswordBodyV>;

export const changePassword = (
  req: ChangePasswordRequest,
  res: BackendResponse
) => {
  handleBadRequest(ChangePasswordBodyV, req.body, res).then(() => {
    const { new_password } = req.body;
    const user = res.locals.user;

    if (!user) {
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }

    storePassword(new_password, user, result => {
      if ('error' in result) {
        res
          .status(result.code)
          .send({ error: result.error, error_details: result.error_details });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.passwordChanged });
      return;
    });
  });
};

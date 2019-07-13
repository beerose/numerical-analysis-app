import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import {
  BackendResponse,
  GetRequest,
  handleBadRequest,
  sendResetPasswordLink,
} from '../../lib';
import { db } from '../../store';

const ResetPasswordBodyV = t.type({
  email: t.string,
});

type ResetPasswordRequest = GetRequest<typeof ResetPasswordBodyV>;

export const resetPassword = (
  req: ResetPasswordRequest,
  res: BackendResponse
) => {
  handleBadRequest(ResetPasswordBodyV, req.body, res).then(() => {
    const { email } = req.body;

    db.findUserByEmail({ email }, (err, user) => {
      if (err) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
        return;
      }

      if (!user) {
        res.status(codes.NOT_FOUND).send({
          error: apiMessages.userNotFound,
        });
        return;
      }

      sendResetPasswordLink(user);
    });
  });
};

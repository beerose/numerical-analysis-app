import { apiMessages, UserRole } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest } from '../../lib';
import { sendRegistrationLink } from '../../lib/email';

const SendInvitationBodyV = t.type({
  email: t.string,
  user_name: t.string,
  user_role: t.union([
    t.literal(UserRole.Admin),
    t.literal(UserRole.SuperUser),
    t.literal(UserRole.Student),
  ]),
});

export const sendInvitation = (req: Request, res: BackendResponse) => {
  handleBadRequest(SendInvitationBodyV, req.body, res as Response).then(
    body => {
      sendRegistrationLink(body, err => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            message: apiMessages.internalError,
            error_details: err.message,
          });
        }
        return res
          .status(codes.OK)
          .send({ message: apiMessages.invitationSent });
      });
    }
  );
};

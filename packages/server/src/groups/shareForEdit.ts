import { apiMessages, ApiResponse, UserPrivileges } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { db } from '../store';

const ShareForEditBodyV = t.type({
  group_id: t.number,
  user_id: t.number,
});

type ShareForEditRequest = PostRequest<typeof ShareForEditBodyV>;

export const share = (req: ShareForEditRequest, res: Response) => {
  handleBadRequest(ShareForEditBodyV, req.body, res).then(() => {
    const { group_id, user_id } = req.body;
    db.getUserPrivileges({ userId: user_id }, (getErr, privileges) => {
      if (getErr) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: getErr.message,
        } as ApiResponse);
        return;
      }
      let newPrivileges: UserPrivileges;
      if (!privileges) {
        newPrivileges = {
          groups: {
            [group_id]: ['edit', 'read'],
          },
        };
      } else {
        const privilegesJSON: UserPrivileges = JSON.parse(privileges);
        newPrivileges = {
          groups: {
            ...privilegesJSON.groups,
            [group_id]: ['edit', 'read'],
          },
          users: privilegesJSON.users,
        };
      }

      db.setUserPrivileges(
        { userId: user_id, privileges: newPrivileges },
        setErr => {
          if (setErr) {
            return res.status(codes.INTERNAL_SERVER_ERROR).send({
              error: apiMessages.internalError,
              error_details: setErr.message,
            } as ApiResponse);
          }

          return res.status(codes.OK).send({
            message: apiMessages.groupWasShared,
          });
        }
      );
    });
  });
};

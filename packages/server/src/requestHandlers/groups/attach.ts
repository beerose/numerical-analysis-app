import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const AttachBodyV = t.type({
  group_id: t.number,
  parent_group_id: t.number,
});

type AttachRequest = PostRequest<typeof AttachBodyV>;

export const attach = (req: AttachRequest, res: BackendResponse) =>
  handleBadRequest(AttachBodyV, req.body, res).then(() => {
    db.attachGroup(
      {
        groupId: req.body.group_id,
        parentGroupId: req.body.parent_group_id,
      },
      err => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }

        res.status(codes.OK).send({ message: apiMessages.groupAttached });
      }
    );
  });

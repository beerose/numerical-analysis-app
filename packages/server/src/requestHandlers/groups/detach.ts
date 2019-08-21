import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const DetachBodyV = t.type({
  group_id: t.number,
});

type DetachRequest = PostRequest<typeof DetachBodyV>;

export const detach = (req: DetachRequest, res: BackendResponse) =>
  handleBadRequest(DetachBodyV, req.body, res).then(() => {
    db.detachGroup(
      {
        groupId: req.body.group_id,
      },
      err => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }

        res.status(codes.OK).send({ message: apiMessages.groupDetached });
      }
    );
  });

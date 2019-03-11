import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { BackendResponse } from '../lib/response';
import { db } from '../store';

const DeleteGroupBodyV = t.type({
  group_id: t.number,
});

type DeleteGroupRequest = PostRequest<typeof DeleteGroupBodyV>;

export const deleteGroup = (req: DeleteGroupRequest, res: BackendResponse) => {
  handleBadRequest(DeleteGroupBodyV, req.body, res).then(() => {
    const { group_id } = req.body;

    db.deleteGroup({ groupId: group_id }, err => {
      if (err) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.groupDeleted });
    });
  });
};

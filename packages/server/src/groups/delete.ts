import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { db } from '../store';

const DeleteGroupBodyV = t.type({
  group_id: t.number,
});

type DeleteGroupRequest = PostRequest<typeof DeleteGroupBodyV>;

export const deleteGroup = (req: DeleteGroupRequest, res: Response) => {
  handleBadRequest(DeleteGroupBodyV, req.body, res).then(() => {
    const { group_id } = req.body;

    db.deleteGroup({ groupId: group_id }, err => {
      if (err) {
        console.error(err);
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.groupDeleted });
    });
  });
};

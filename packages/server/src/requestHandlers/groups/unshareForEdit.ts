import { apiMessages, ApiResponse, UserPrivileges, UserRole } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { adjustPrivileges } from '../../lib/adjustPrivileges';

const UnshareForEditBodyV = t.type({
  group_id: t.number,
  user_id: t.number,
});

type UnshareForEditRequest = PostRequest<typeof UnshareForEditBodyV>;

export const unshare = (req: UnshareForEditRequest, res: BackendResponse) => {
  handleBadRequest(UnshareForEditBodyV, req.body, res).then(() => {
    const { group_id: groupId, user_id: userId } = req.body;
    adjustPrivileges.add(groupId, userId, [], err => {
      if (err) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      res.status(codes.OK).send({ message: apiMessages.groupWasUnshared });
    });
  });
};

import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../../store';

export const listStudentsForGroup = (_: Request, res: Response) => {
  return db.listUsersWithGroup((err, students) => {
    if (err) {
      console.log(err);
      return res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
    }
    return res.status(codes.OK).send({
      students: students.map(s => ({
        ...s,
        group_ids: s.group_ids
          ? s.group_ids.split(',').map(Number)
          : [],
      })),
    });
  });
};

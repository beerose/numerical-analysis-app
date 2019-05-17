import { UserRole } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';

import { BackendResponse } from '../../lib';
import { fsStorage } from '../../store';

import { FilePathsDTO } from './index';

export interface UploadFilesRequest extends Request {
  body:
    | {
        filePath?: undefined;
        overwrite?: undefined;
      }
    | {
        filePath: string;
        overwrite: boolean;
      };
}

/**
 * uploadFiles
 * @method POST
 */

export function uploadFiles(
  req: UploadFilesRequest,
  res: BackendResponse<FilePathsDTO>
) {
  if (!Array.isArray(req.files)) {
    res.status(codes.BAD_REQUEST).send({ error: 'files not uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const { filePath, overwrite } = req.body;

  if (
    filePath &&
    res.locals.user &&
    res.locals.user.user_role === UserRole.Student
  ) {
    return res
      .status(codes.FORBIDDEN)
      .send({ error: "students can't upload files with file path" });
  }
  return Promise.all(
    files.map(f => fsStorage.accept(f, filePath, { overwrite }))
  )
    .then(fileNames => {
      res.status(codes.OK).send({ paths: fileNames });
    })
    .catch((err: Error) =>
      res.status(codes.BAD_REQUEST).send({ error: err.message })
    );
}

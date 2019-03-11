import { Dirent } from 'fs';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { fsStorage } from '../../store';

import { DirectoryListingDTO } from './index';

function direntToDTO(dirent: Dirent): DirectoryListingDTO[number] {
  const x: DirectoryListingDTO[number] = { name: dirent.name };
  if (dirent.isDirectory()) {
    x.is_directory = true;
  }
  return x;
}

const ListFilesRequestV = t.partial({
  directory: t.string,
});
type ListFilesRequest = GetRequest<typeof ListFilesRequestV>;

export function listFiles(
  req: ListFilesRequest,
  res: BackendResponse<DirectoryListingDTO>
) {
  return handleBadRequest(ListFilesRequestV, req.query, res)
    .then(({ directory }) => fsStorage.list(directory))
    .then(dirents => {
      res.status(codes.OK).send(dirents.map(direntToDTO));
    });
}

import { ServerRoutes } from 'common';
import { Router } from 'express';

import { upload } from '../../middleware';

import { listFiles } from './listFiles';
import { uploadDemoPage } from './uploadDemoPage';
import { uploadFiles } from './uploadFiles';

export const router = Router();

// tslint:disable-next-line:no-commented-code
// type FileDetailsDTO = object;

export type FilePathsDTO = {
  paths: string[];
};

export type DirectoryListingDTO = Array<{
  name: string;
  is_directory?: boolean;
}>;

router.get(
  ServerRoutes.Files,
  // auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  listFiles
);

router.post(
  ServerRoutes.Files,
  // auth.authorize(userRoleOptions),
  upload.array('files'),
  uploadFiles
);

if (process.env.NODE_ENV === 'development') {
  router.get(`${ServerRoutes.Files}/test-upload`, uploadDemoPage);
}

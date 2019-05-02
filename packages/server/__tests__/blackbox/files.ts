import { ServerRoutes } from 'common';

import { DirectoryListingDTO } from '../../src/requestHandlers/files';
import { fetch } from '../fetch';

describe('files', () => {
  describe(`get ${ServerRoutes.Files}`, () => {
    it('admin can list files', () => {
      return fetch
        .asAdmin(ServerRoutes.Files)
        .expectStatus(200)
        .then(res => res.json())
        .then((listing: DirectoryListingDTO) => {
          expect(Array.isArray(listing)).toBe(true);
        });
    });
  });

  describe(`post ${ServerRoutes.Files}`, () => {
    it('lecturer can upload files with filePath', () => {
      // TODO: Check out what's sent by demo page
    });
  });
});

/**
 * TODO: test cases
 * # files
 * - lecturer can list files ✔ (1/2)
 * - student can list files he uploaded
 * # upload
 * - student can upload a file
 * - student can't upload files with filePath
 * - lecturer can upload files with filePath
 * - overwrite=false responds with error when file exists
 * - overwrite=true overwrites the file
 *
 * Backlog
 * - lecturer can filter files by student
 * - lecturer can see solutions to a task (filter files by task)
 */

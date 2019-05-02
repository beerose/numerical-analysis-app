import { ServerRoutes } from 'common';

import { authFetchAdmin, fetch } from './fetch';

describe('post /files', () => {
  it('uploads many files', () => {
    return authFetchAdmin(ServerRoutes.Files).expectStatus(200);
    // .then(
    //   res => expect(2).toBe(2),
    //   // res
    //   //   .json()
    //   //   .then(text => expect(text.startsWith('Hello!')).toBeTruthy()),
    //   fail
    // );
  });
});

/**
 * TODO: test cases
 * # files
 * - lecturer can list files
 * - student can list files which he uploaded
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

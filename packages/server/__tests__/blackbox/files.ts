import { ServerRoutes } from 'common';

import { fetch } from './fetch';

// describe('post /files', () => {
//   it('uploads many files', () => {
//     const formData = new FormData();

//     return fetch(ServerRoutes.Files, {
//       headers = {
//         // 'Accept': 'application/json',
//         'Authorization':
//       }
//       body: formData as any, //FIXME?
//       method: 'POST',
//     }).expectStatus(200);
//     // .then(
//     //   res => expect(2).toBe(2),
//     //   // res
//     //   //   .json()
//     //   //   .then(text => expect(text.startsWith('Hello!')).toBeTruthy()),
//     //   fail
//     // );
//   });
// });

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

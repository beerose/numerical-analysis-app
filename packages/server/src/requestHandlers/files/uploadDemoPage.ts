import { ServerRoutes } from 'common';
import { RequestHandler } from 'express';
import * as codes from 'http-status-codes';

export const uploadDemoPage: RequestHandler = (_, res) => {
  res.status(codes.OK).send(/* html */ `
    <html>
      <head>
        <title>test upload</title>
      </head>
      <body>
        <form action="${
          ServerRoutes.Files
        }" method="post" enctype="multipart/form-data">
          <input type="file" name="files" multiple />
          <label>
            name
            <input type="text" name="filePath" />
          </label>
          <button>Submit</button>
        </form>
      </body>
    </html>
  `);
};

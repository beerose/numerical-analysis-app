import * as fs from 'fs';
import mime from 'mime';
import { diskStorage } from 'multer';
import { dirname, join } from 'path';
import { promisify } from 'util';
import { hash } from 'xxhash';

const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

export const storageDir = join(__dirname, '../../..', '.storage');

/**
 * Lists all files
 */
export function list(directory?: string) {
  // tslint:disable-next-line:non-literal-fs-path
  return readdir(join(storageDir, directory || '/'), {
    withFileTypes: true,
  });
}

type File = Express.Multer.File;

const SEED = 0;
function makeTemporaryName(file: File) {
  return [
    hash(Buffer.from(file.originalname), SEED, 'hex'),
    Date.now(),
    mime.extension(file.mimetype),
  ].join('.');
}

function isOutsideOfStorageDir(filePath: string) {
  return !filePath.startsWith(storageDir);
}

export const diskStorageOptions = {
  storage: diskStorage({
    destination: join(storageDir, '__temp'),
    filename(_req, file, cb) {
      cb(null, makeTemporaryName(file));
    },
  }),
};

/**
 * Moves out of temp dir and renames to final name.
 * Can overwrite if file of the same name exists.
 * @returns promise of new path to file
 *
 * @example
 * accept(file) // uses hashed originalname and Date.now()
 * accept(file, 'tasks/1')
 * accept(file, 'dank/memes/jack-sparrow.jpg')
 */
export async function accept(
  file: File,
  filePath?: string,
  { overwrite = false } = {}
) {
  const fPath = filePath || file.filename;
  const newPath = join(storageDir, fPath);

  if (filePath && isOutsideOfStorageDir(newPath)) {
    throw new Error("Can't put file outside of storage dir");
  }

  if (!overwrite && (await exists(newPath))) {
    throw new Error('file already exists');
  }

  if (fPath.includes('/')) {
    const directory = dirname(newPath);
    const directoryExists = await exists(directory);
    if (!directoryExists) {
      await mkdir(directory, { recursive: true });
    }
  }

  // tslint:disable-next-line:non-literal-fs-path
  await rename(file.path, newPath);

  return fPath;
}

/**
 * Removes a file from storage dir
 */
export async function remove(file: File) {
  if (isOutsideOfStorageDir(file.path)) {
    throw new Error("Can't remove file that's not inside storage dir");
  }
  return unlink(file.path);
}

import multer = require('multer');

import { diskStorageOptions } from '../store/filesystem';

export const upload = multer(diskStorageOptions);

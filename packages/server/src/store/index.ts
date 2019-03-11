import * as fsStorage from './filesystem';
import * as db from './mysql';

export { db, fsStorage };

export const DUPLICATE_ENTRY_ERROR = 'ER_DUP_ENTRY';

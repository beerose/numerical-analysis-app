import { FieldInfo, MysqlError } from 'mysql';

// Todo replace this `any` with `undefined`
export type QueryCallback<Result = any> = (
  err: MysqlError | null,
  results: Result,
  fields?: FieldInfo[]
) => void;

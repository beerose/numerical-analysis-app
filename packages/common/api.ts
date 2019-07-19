import * as t from 'io-ts';
export type ApiResponse =
  | {
      message: string;
    }
  | {
      error: string;
      error_details?: string;
    };

export type Pagination = {
  offset: number;
  limit: number;
};

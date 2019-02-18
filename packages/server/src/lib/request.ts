import { apiMessages, ApiResponse } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

export interface GetRequest<QueryValidator extends t.Any> extends Request {
  query: t.TypeOf<QueryValidator>;
}

export interface PostRequest<BodyValidator extends t.Any> extends Request {
  body: t.TypeOf<BodyValidator>;
}

export function handleBadRequest<Decoder extends t.Decoder<any, A>, A>(
  decoder: Decoder,
  payload: A,
  response: Response
): Promise<A> {
  return new Promise(resolve => {
    const result = decoder.decode(payload);
    result.fold(_err => {
      response.status(codes.BAD_REQUEST).send({
        error: apiMessages.invalidRequest,
        // tslint:disable-next-line:object-literal-sort-keys
        errorDetails: reporter(result).join('\n'),
      });
    }, resolve);
  });
}

export interface ServerResponse<T = ApiResponse> extends Response {
  send: (res: T) => Response;
}

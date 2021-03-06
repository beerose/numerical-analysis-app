import { Request, Response } from 'express';
import { fold } from 'fp-ts/lib/Either';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

type GetRequestValidator<
  QueryValidator extends t.Any,
  ParamsValidator extends t.Any
> = t.TypeC<{
  query: QueryValidator;
  params: ParamsValidator;
}>;

interface GetRequestI<
  QueryValidator extends t.Any,
  ParamsValidator extends t.Any = t.Any
> extends Request {
  query: t.TypeOf<QueryValidator>;
  params: t.TypeOf<ParamsValidator>;
}

export type GetRequest<
  QueryValidator extends t.Any | GetRequestValidator<any, any>,
  ParamsValidator extends t.Any = t.Any
> = QueryValidator extends GetRequestValidator<infer Q, infer P>
  ? GetRequestI<Q, P>
  : QueryValidator extends t.Any
  ? GetRequestI<QueryValidator, ParamsValidator>
  : never;

export interface PostRequest<BodyValidator extends t.Any> extends Request {
  body: t.TypeOf<BodyValidator>;
}

type GetDecoded<Decoder> = Decoder extends t.Decoder<any, infer A> ? A : never;

export function handleBadRequest<Decoder extends t.Decoder<any, any>>(
  decoder: Decoder,
  payload: unknown,
  response: Response
): Promise<GetDecoded<Decoder>> {
  return new Promise(resolve => {
    const result = decoder.decode(payload);
    fold(_err => {
      response.status(codes.BAD_REQUEST).send({
        error: 'Bad request',
        error_details: reporter(result).join('\n'),
      });
    }, resolve)(result);
  });
}

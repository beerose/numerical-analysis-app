import { makeFetch } from 'supertest-fetch';

import { app } from '../../src/server';

export const fetch = makeFetch(app);

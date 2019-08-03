import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, map } from 'fp-ts/lib/Array';
import { concat, mergeDeepWith, reduce, sortBy, tap } from 'ramda';

type Route = {
  path: string;
  methods: Record<string, boolean>;
};

type Middleware = {
  name: string;
  route: Route;
  handle: { stack: Array<{ route?: Route }> };
};

type ExpressApp = import('express-serve-static-core').Express;

/**
 * Adapted from
 * https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express/14934933
 */
function getRegisteredRoutes(expressApp: ExpressApp) {
  return array.chain(expressApp._router.stack as Middleware[], middleware => {
    if (middleware.route) {
      // routes registered directly on the app
      return [middleware.route];
    }
    if (middleware.name === 'router') {
      // router middleware
      return middleware.handle.stack
        .filter((h): h is { route: Route } => h.route !== undefined)
        .map(handler => handler.route);
    }
    return [];
  });
}
function formatRoutesArray(routes: Route[]) {
  return pipe(
    routes,
    sortBy(x => x.path),
    map(x => ({
      [x.path]: Object.entries(x.methods)
        .filter(([_, isOn]) => isOn)
        .map(([method]) => method),
    })),
    reduce(mergeDeepWith(concat), {})
  );
}

export const displayRegisteredRoutes = flow(
  getRegisteredRoutes,
  formatRoutesArray
);

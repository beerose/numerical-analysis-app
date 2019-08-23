import stripIndent from 'strip-indent';
import util from 'util';

const inspect = (x: unknown) => (typeof x === 'string' ? x : util.inspect(x));

function interweave(
  s: TemplateStringsArray,
  interpolations: any[],
  mapInterpolation: (x: any) => string
): Array<string | unknown> {
  const res = [];
  // tslint:disable-next-line: no-increment-decrement
  for (let i = 0; i < s.length - 1; ++i) {
    res.push(s[i], mapInterpolation(interpolations[i]));
  }
  res.push(s[s.length - 1]);
  return res;
}

export function echo(s: TemplateStringsArray, ...interpolations: any[]) {
  // tslint:disable-next-line: no-console
  console.log(stripIndent(interweave(s, interpolations, inspect).join('')));
}

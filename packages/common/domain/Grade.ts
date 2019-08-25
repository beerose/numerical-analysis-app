export type Grade = 2 | 3 | 3.5 | 4 | 4.5 | 5;

export function Grade(k: number): Grade {
  if (process.env.NODE_ENV !== 'production') {
    console.assert([2, 3, 3.5, 4, 4.5, 5].includes(k), `${k} is not a Grade`);
  }

  return k as Grade;
}

export namespace Grade {
  export const grades = [2, 3, 3.5, 4, 4.5, 5] as const;
}

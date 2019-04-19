export type Grade = 2 | 3 | 3.5 | 4 | 4.5 | 5;

export const Grade = (k: number): Grade => {
  if (process.env.NODE_ENV === 'development') {
    console.assert([2, 3, 3.5, 4, 4.5, 5].includes(k), `${k} is not a Grade`);
  }

  return k as Grade;
};

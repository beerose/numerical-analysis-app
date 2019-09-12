export const panic = (err: Error | string) => {
  throw typeof err === 'string' ? new Error(err) : err;
};

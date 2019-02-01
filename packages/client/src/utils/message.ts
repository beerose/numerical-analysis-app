import { message } from 'antd';
import { ApiResponse } from 'common';

export const showMessage = (
  res: ApiResponse,
  opts?: { errorOnly: boolean; successOnly: boolean }
) => {
  if ('error' in res && !(opts && opts.successOnly)) {
    message.error(res.error);
    return;
  }
  if ('message' in res && !(opts && opts.errorOnly)) {
    message.success(res.message);
  }
};

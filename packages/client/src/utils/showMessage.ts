import { message } from 'antd';
import { ApiResponse } from 'common';

import { ApiResponse2 } from '../api/authFetch';

message.config({ maxCount: 3, duration: 2 });

export const showMessage = (
  res: ApiResponse | ApiResponse2<any>,
  opts: { showSuccess?: boolean; showError?: boolean } = {
    showError: true,
    showSuccess: true,
  }
) => {
  if ('error' in res && opts.showError) {
    message.error(res.error);
    return;
  }
  if ('message' in res && opts.showSuccess) {
    message.success(res.message);
  }
};

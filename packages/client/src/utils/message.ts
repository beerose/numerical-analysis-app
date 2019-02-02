import { message } from 'antd';
import { ApiResponse } from 'common';

export const showMessage = (
  res: ApiResponse,
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

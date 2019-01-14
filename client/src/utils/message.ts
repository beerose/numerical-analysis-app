import { message } from 'antd';
import { ApiResponse } from 'common';

export const showMessage = (res: ApiResponse) => {
  if ('error' in res) {
    message.error(res.error);
    return;
  }
  message.success(res.message);
};

import { message } from 'antd';

import { ApiResponse } from '../../../common/api';

export const showMessage = (res: ApiResponse) => {
  if (res.error) {
    message.error(res.error);
    return;
  }
  message.success(res.message);
};

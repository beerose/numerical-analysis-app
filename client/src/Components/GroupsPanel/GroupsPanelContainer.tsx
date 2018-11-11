import { css } from 'emotion';
import * as React from 'react';

import { groupsService } from '../../api';

import { UploadUsers } from './';

export const GroupsPanelContainer = () => {
  const onUpload = (fileContent: string) => {
    groupsService.uploadUsers(fileContent).then(res => {
      console.log(res);
    });
  };
  return (
    <UploadUsers
      onUpload={onUpload}
      className={css`
        margin: 20px 20px 20px 0;
      `}
    />
  );
};

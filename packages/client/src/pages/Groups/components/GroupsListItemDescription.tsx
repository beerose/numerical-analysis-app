import { css } from '@emotion/core';
import { GroupDTO, UserDTO } from 'common';
import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';

export type GroupsListItemDescriptionProps = {
  lecturerId: UserDTO['id'];
  lecturerName: string;
  group: GroupDTO;
};

export const GroupsListItemDescription: React.FC<
  GroupsListItemDescriptionProps
> = ({ lecturerId, lecturerName, group }) => {
  const { texts } = useContext(LocaleContext);

  return (
    <Fragment>
      <Link
        to={`/users/${lecturerId}`}
        title={texts.lecturer}
        css={css`
          color: inherit;
        `}
      >
        {lecturerName}
      </Link>
      <span
        css={css`
          margin-left: ${Theme.Padding.Standard};
        `}
      >
        {group.semester}
      </span>
    </Fragment>
  );
};

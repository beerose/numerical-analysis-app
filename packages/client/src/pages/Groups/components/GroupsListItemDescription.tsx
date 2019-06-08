/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { GroupDTO, UserDTO } from 'common';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';

export type GroupsListItemDescriptionProps = {
  lecturerId: UserDTO['id'];
  lecturerName: string;
  group: GroupDTO;
};

const DetailsListItem = styled.li`
  margin-right: ${Theme.Padding.Standard};
`;

const DetailsList = styled.ul`
  color: rgba(0, 0, 0, 0.65);

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));

  padding: 0;
  list-style: none;
`;

export const GroupsListItemDescription: React.FC<
  GroupsListItemDescriptionProps
> = ({ lecturerId, lecturerName, group }) => {
  const { texts } = useContext(LocaleContext);

  return (
    <DetailsList>
      <DetailsListItem>
        {texts.lecturer + ': '}
        <Link
          to={`/users/${lecturerId}`}
          title={texts.lecturer.toLowerCase()}
          css={css`
            height: 100%;
            font-weight: bold;
          `}
        >
          {lecturerName}
        </Link>
      </DetailsListItem>
      <DetailsListItem>
        {texts.groupType}: <b>{texts[group.group_type]}</b>
      </DetailsListItem>
      <DetailsListItem>
        {texts.semester}: <b>{group.semester}</b>
      </DetailsListItem>
    </DetailsList>
  );
};

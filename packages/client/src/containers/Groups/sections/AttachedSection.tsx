import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { GroupApiContextState } from '../GroupApiContext';
import { Flex, DeleteWithConfirm, Theme } from '../../../components';
import { List } from 'antd';
import { GroupDTO } from 'common';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const AttachedSection = (props: Props) => {
  const [attached, setAttached] = useState<GroupDTO[]>([]);

  useEffect(() => {
    props.actions.getAttached().then(res => {
      setAttached(res.groups);
    });
  }, [props.actions]);

  return (
    <Flex padding={Theme.Padding.Standard}>
      <List
        itemLayout="horizontal"
        dataSource={attached}
        renderItem={(item: GroupDTO) => (
          <List.Item
            actions={[
              <DeleteWithConfirm
                onConfirm={console.log}
                label="Odepnij grupę"
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <a onClick={() => props.history.push(`/groups/${item.id}`)}>
                  {item.group_name}
                </a>
              }
            />
          </List.Item>
        )}
      />
    </Flex>
  );
};

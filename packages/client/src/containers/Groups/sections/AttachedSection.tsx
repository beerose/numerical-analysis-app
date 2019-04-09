import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { GroupApiContextState } from '../GroupApiContext';
import { Flex, DeleteWithConfirm } from '../../../components';
import { List } from 'antd';
import { GroupDTO } from 'common';
import { Link } from 'react-router-dom';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const AttachedSection = (props: Props) => {
  const [attached, setAttached] = useState<GroupDTO[]>([]);

  useEffect(() => {
    props.actions.getAttached().then(res => {
      setAttached(res.groups);
    });
  }, [props.actions]);

  return (
    <Flex justifyContent="center">
      <List
        itemLayout="horizontal"
        dataSource={attached}
        renderItem={(item: GroupDTO) => (
          <List.Item
            actions={[
              <DeleteWithConfirm onConfirm={console.log}>
                <a>Odepnij grupę</a>
              </DeleteWithConfirm>,
            ]}
          >
            <List.Item.Meta
              title={<Link to={`/groups/${item.id}`}>{item.group_name}</Link>}
            />
          </List.Item>
        )}
      />
    </Flex>
  );
};

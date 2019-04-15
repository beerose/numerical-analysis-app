import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { GroupApiContextState } from '../GroupApiContext';
import { Flex, DeleteWithConfirm, Theme } from '../../../components';
import { List, Modal, Select, Spin } from 'antd';
import { GroupDTO } from 'common';
import { Button } from 'antd';
import { LABELS, showMessage } from '../../../utils';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const AttachedSection = (props: Props) => {
  const [attached, setAttached] = useState<GroupDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    props.actions.getAttached().then(res => {
      setAttached(res.groups);
    });
    if (!props.groups) {
      props.actions.listGroups();
    }
  }, [props.actions]);

  const handleAttachGroup = () => {
    if (!selectedGroup) {
      showMessage({ error: 'Musisz wybrać grupę' });
      return;
    }
    props.actions.attach(selectedGroup).then(res => {
      setModalVisible(false);
      setSelectedGroup(undefined);

      showMessage(res);

      props.actions.getAttached().then(res => {
        setAttached(res.groups);
      });
    });
  };

  const attachedGroupIds = attached.map(g => g.id);

  return (
    <Flex padding={Theme.Padding.Standard} flexDirection="column">
      <Button
        type="primary"
        style={{ width: 180, marginBottom: 20 }}
        onClick={() => setModalVisible(true)}
      >
        Podepnij nową grupę
      </Button>
      <Modal
        visible={modalVisible}
        cancelText="Cofnij"
        okText={LABELS.save}
        onCancel={() => setModalVisible(false)}
        onOk={handleAttachGroup}
      >
        Wybierz grupę:
        <Select
          style={{ width: '300px', margin: Theme.Padding.Half }}
          onChange={(value: GroupDTO['id']) => setSelectedGroup(value)}
          defaultValue={undefined}
        >
          {props.groups ? (
            props.groups
              .filter(g => !attachedGroupIds.includes(g.id))
              .map(group => (
                <Select.Option key={group.id.toString()} value={group.id}>
                  {group.group_name}
                </Select.Option>
              ))
          ) : (
            <Spin />
          )}
        </Select>
      </Modal>
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

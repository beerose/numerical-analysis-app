import { Button, List, Modal, Select, Spin } from 'antd';
import { GroupDTO } from 'common';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { DeleteWithConfirmation, Flex, theme } from '../../../components';
import { findStringifiedLowercase, LABELS, showMessage } from '../../../utils';
import { GroupApiContextState } from '../GroupApiContext';

type Props = GroupApiContextState &
  Pick<RouteComponentProps, 'history'> & {
    editable: boolean;
  };
export const AttachedGroupsSection = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [attached, setAttached] = useState<GroupDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>(
    undefined
  );

  const getAttachedGroups = async () => {
    setLoading(true);
    props.actions.getAttached().then(res => {
      setAttached(res.groups);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAttachedGroups();

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

      getAttachedGroups();
    });
  };

  const handleDetachGroup = (groupId: GroupDTO['id']) => {
    props.actions.detach(groupId).then(res => {
      showMessage(res);

      getAttachedGroups();
    });
  };

  const attachedGroupIds = attached.map(g => g.id);

  return (
    <Flex padding={theme.Padding.Standard} flexDirection="column">
      {props.editable && (
        <Button
          type="primary"
          style={{ width: 180, marginBottom: 20 }}
          onClick={() => setModalVisible(true)}
        >
          Podepnij nową grupę
        </Button>
      )}
      <Modal
        visible={modalVisible}
        cancelText="Cofnij"
        okText={LABELS.save}
        onCancel={() => setModalVisible(false)}
        onOk={handleAttachGroup}
      >
        Wybierz grupę:
        <Select
          showSearch
          filterOption={findStringifiedLowercase}
          style={{ width: '300px', margin: theme.Padding.Half }}
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
      {loading ? (
        <Spin />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={attached}
          renderItem={(item: GroupDTO) => (
            <List.Item
              actions={
                props.editable
                  ? [
                      <DeleteWithConfirmation
                        onConfirm={() => handleDetachGroup(item.id)}
                        label="Odepnij grupę"
                      />,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={
                  <a
                    role="link"
                    onClick={() => {
                      props.actions.cleanCurrentGroup();
                      props.history.push(`/groups/${item.id}`);
                    }}
                  >
                    {item.group_name}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Flex>
  );
};

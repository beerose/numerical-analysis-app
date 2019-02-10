/** jsx @jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Col, Form, Input, Row } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import React, { useContext, useEffect } from 'react';

import { GroupDTO } from '../../../../../../dist/common';
import { LocaleContext } from '../../../components/locale';
import { GroupEquation } from '../components/GradeEquation';
import { SelectSuperUser } from '../components/SelectSuperUser';
import { GroupApiContextState } from '../GroupApiContext';

const SettingsForm = styled.form`
  margin-left: 40px;
  margin-top: 30px;
  height: 80vh;
  > div {
    padding-bottom: 15px;
  }
`;

type FormState = Pick<GroupDTO, 'class_number' | 'group_name' | 'lecturer_id'>;

type Props = GroupApiContextState & FormComponentProps;

const SettingsSectionInternal: React.FC<Props> = ({
  actions,
  currentGroup: group,
  form,
  superUsers,
}) => {
  const { texts } = useContext(LocaleContext);

  if (!group) {
    throw new Error('No group');
  }

  useEffect(() => {
    actions.listLecturers();

    const initialState: FormState = {
      class_number: group.class_number,
      group_name: group.group_name,
      lecturer_id: group.lecturer_id,
    };
    form.setFieldsValue(initialState);
  }, [group]);

  console.log(group);

  const { getFieldDecorator } = form;

  return (
    <SettingsForm onSubmit={console.log}>
      <Row gutter={8}>
        <Col span={4}>
          <b>{texts.lecturer}: </b>
        </Col>
        <Col span={16}>
          {getFieldDecorator<FormState>('lecturer_id')(
            <SelectSuperUser
              superUsers={superUsers}
              css={{
                width: '100%',
              }}
            />
          )}
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <b>{texts.groupName}: </b>
        </Col>
        <Col span={16}>
          {getFieldDecorator<FormState>('group_name')(<Input />)}
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <b>{texts.classRoomNumber}: </b>
        </Col>
        <Col span={16}>
          {getFieldDecorator<FormState>('class_number')(<Input />)}
        </Col>
      </Row>
      <GroupEquation />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </SettingsForm>
  );
};

export const SettingsSection = Form.create()(SettingsSectionInternal);

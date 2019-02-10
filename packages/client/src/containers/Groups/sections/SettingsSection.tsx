/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Col, Form, Input, Row } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import React, { useContext, useEffect, useState } from 'react';

import { GroupDTO } from '../../../../../../dist/common';
import { LocaleContext } from '../../../components/locale';
import { GroupEquation } from '../components/GradeEquation';
import { GroupTypeRadioGroup } from '../components/GroupTypeRadioGroup';
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

type FormRowProps = {
  label: string;
};
const FormRow: React.FC<FormRowProps> = ({ label, children }) => (
  <Row gutter={8}>
    <label>
      <Col span={4}>
        <b>{label}</b>
      </Col>
      <Col span={16}>{children}</Col>
    </label>
  </Row>
);

type FormState = Pick<
  GroupDTO,
  'class_number' | 'group_name' | 'group_type' | 'lecturer_id'
>;

type Props = GroupApiContextState & FormComponentProps;

const SettingsSectionInternal: React.FC<Props> = ({
  actions,
  currentGroup: group,
  form,
  superUsers,
}) => {
  if (!group) {
    throw new Error('No group');
  }

  const [equation, setEquation] = useState('activity + presence * 0.5');
  const { texts } = useContext(LocaleContext);

  useEffect(() => {
    actions.listLecturers();

    const initialState: FormState = {
      class_number: group.class_number,
      group_name: group.group_name,
      group_type: group.group_type,
      lecturer_id: group.lecturer_id,
    };
    form.setFieldsValue(initialState);
  }, [group]);

  const { getFieldDecorator } = form;
  return (
    <SettingsForm
      onSubmit={event => {
        event.preventDefault();
        form.validateFields((err, values) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(values);
        });
      }}
    >
      <FormRow label={texts.groupName}>
        {getFieldDecorator<FormState>('group_name')(<Input />)}
      </FormRow>
      <FormRow label={texts.groupType}>
        {getFieldDecorator<FormState>('group_type')(
          <GroupTypeRadioGroup
            css={css`
              display: flex;
              > label {
                flex: 1;
                text-align: center;
              }
            `}
          />
        )}
      </FormRow>
      <FormRow label={texts.lecturer}>
        {getFieldDecorator<FormState>('lecturer_id')(
          <SelectSuperUser
            superUsers={superUsers}
            css={{
              width: '100%',
            }}
          />
        )}
      </FormRow>
      <FormRow label={texts.classRoomNumber}>
        {getFieldDecorator<FormState>('class_number')(<Input />)}
      </FormRow>
      <GroupEquation value={equation} onChange={setEquation} />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </SettingsForm>
  );
};

export const SettingsSection = Form.create()(SettingsSectionInternal);

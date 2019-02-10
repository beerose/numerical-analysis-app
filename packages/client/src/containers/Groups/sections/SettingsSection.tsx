/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Col, Form, Input, Row } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import fromPairs from 'lodash.frompairs';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DeepRequired } from 'utility-types';

import { GroupDTO, Tresholds } from '../../../../../../dist/common';
import { LocaleContext } from '../../../components/locale';
import { LABELS } from '../../../utils';
import { GroupEquation } from '../components/GradeEquation';
import {
  GradeTresholdsList,
  tresholdsKeys,
} from '../components/GradeTresholdsList';
import { GroupTypeRadioGroup } from '../components/GroupTypeRadioGroup';
import { SelectSuperUser } from '../components/SelectSuperUser';
import { GroupApiContextState } from '../GroupApiContext';

const SettingsForm = styled.form`
  margin-left: 40px;
  margin-top: 20px;
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

type AntFormState = Pick<
  GroupDTO,
  'class_number' | 'group_name' | 'group_type' | 'lecturer_id'
>;

type GroupDataState = DeepRequired<GroupDTO>['data'];

type Props = GroupApiContextState & FormComponentProps;

// tslint:disable-next-line:max-func-body-length
const SettingsSectionInternal: React.FC<Props> = ({
  actions,
  currentGroup: group,
  form,
  superUsers,
}) => {
  if (!group) {
    throw new Error('No group');
  }

  const { texts } = useContext(LocaleContext);
  const [groupDataState, setGroupDataState] = useState<GroupDataState>(() => {
    const {
      tresholds = fromPairs(
        tresholdsKeys.map(k => [k, 0] as [keyof Tresholds, number])
      ),
      grade_equation = '',
    } = group.data || {};

    return {
      grade_equation,
      tresholds,
    };
  });
  const setTresholds = useCallback(tresholds => {
    setGroupDataState(state => ({ ...state, tresholds }));
  }, []);
  const setEquation = useCallback(grade_equation => {
    setGroupDataState(state => ({ ...state, grade_equation }));
  }, []);

  useEffect(() => {
    actions.listLecturers();

    const initialState: AntFormState = {
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
        form.validateFields((err, antFormValues) => {
          if (err) {
            console.error(err);
            return;
          }

          const values = { ...antFormValues, ...groupDataState };
          console.log(values);
        });
      }}
    >
      <FormRow label={texts.groupName}>
        {getFieldDecorator<AntFormState>('group_name')(<Input />)}
      </FormRow>
      <FormRow label={texts.groupType}>
        {getFieldDecorator<AntFormState>('group_type')(
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
        {getFieldDecorator<AntFormState>('lecturer_id')(
          <SelectSuperUser
            superUsers={superUsers}
            css={{
              width: '100%',
            }}
          />
        )}
      </FormRow>
      <FormRow label={texts.classRoomNumber}>
        {getFieldDecorator<AntFormState>('class_number')(<Input />)}
      </FormRow>
      <GroupEquation
        value={groupDataState.grade_equation}
        onChange={setEquation}
      />
      <FormRow label={texts.gradeTresholds}>
        <GradeTresholdsList
          value={groupDataState.tresholds}
          onChange={setTresholds}
        />
      </FormRow>
      <Button type="primary" htmlType="submit">
        {LABELS.save}
      </Button>
    </SettingsForm>
  );
};

export const SettingsSection = Form.create()(SettingsSectionInternal);

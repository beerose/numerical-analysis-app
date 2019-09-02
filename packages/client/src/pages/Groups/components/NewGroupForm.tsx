/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Form, Icon, Input } from 'antd';
// tslint:disable: no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
// tslint:enable: no-submodule-imports
import { GroupType, UserDTO, UserId } from 'common';
import * as React from 'react';

import { Colors, LABELS } from '../../../utils';

import { GroupTypeRadioGroup } from './GroupTypeRadioGroup';
import { SelectLecturer } from './SelectLecturer';
import { SelectSemester } from './SelectSemester';

const FormItem = Form.Item;

const FORM_ITEM_LAYOUT = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 24 },
  },
};

const formStyles = css`
  width: 420px;
`;

export type NewGroupFormValues = {
  semester: string;
  group: GroupType;
  group_name: string;
  lecturer_id: UserId;
};

type Props = {
  lecturers: UserDTO[];
  onSubmit: (group: NewGroupFormValues) => void;
  onCancel: () => void;
  loading: boolean;
} & FormComponentProps;
class NewGroupForm extends React.Component<Props> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ submitting: true });
    this.props.form.validateFields((err, values: NewGroupFormValues) => {
      if (err) {
        return;
      }
      this.props.onSubmit(values);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      onCancel,
      lecturers,
      loading,
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} css={formStyles}>
        <FormItem label={LABELS.group} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('group', {
            rules: [{ required: true, message: LABELS.groupRequired }],
          })(<GroupTypeRadioGroup />)}
        </FormItem>
        <FormItem label={LABELS.superUser} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('lecturer_id', {
            rules: [{ required: true, message: LABELS.nameRequired }],
          })(<SelectLecturer lecturers={lecturers} />)}
        </FormItem>
        <FormItem label={LABELS.groupName} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('group_name', {
            rules: [{ required: true, message: LABELS.groupNameRequired }],
          })(
            <Input
              prefix={
                <Icon type="tags" style={{ color: Colors.SemiLightGray }} />
              }
              placeholder={LABELS.groupName}
            />
          )}
        </FormItem>
        <FormItem label={LABELS.semester} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('semester', {
            rules: [{ required: true, message: LABELS.semesterRequired }],
          })(<SelectSemester />)}
        </FormItem>
        <FormItem
          wrapperCol={{
            sm: { span: 16, offset: 8 },
            xs: { span: 24, offset: 0 },
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: '5px' }}
            loading={loading}
          >
            Dodaj
          </Button>
          <Button
            type="default"
            style={{ marginLeft: '5px' }}
            onClick={onCancel}
          >
            Anuluj
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export const WrappedNewGroupForm = Form.create<Props>()(NewGroupForm);

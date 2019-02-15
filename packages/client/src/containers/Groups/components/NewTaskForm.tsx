/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, DatePicker, Form, Icon, Input, Switch } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { Omit } from 'react-router';

import { TaskDTO } from '../../../../../../dist/common';
import { Flex, TaskTypeRadioGroup } from '../../../components';
import { Colors } from '../../../utils';

const formStyles = css`
  padding-top: 25px;
  padding-right: 25px;
  width: 700px;
`;

const FORM_ITEM_LAYOUT = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 16 },
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 16 },
  },
};

type Props = {
  onSubmit: (values: Omit<TaskDTO, 'id'>) => void;
} & FormComponentProps;
const NewTaskForm = (props: Props) => {
  const { getFieldDecorator } = props.form;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      props.onSubmit(values);
      setTimeout(() => {
        props.form.resetFields();
      }, 1000);
    });
  };

  return (
    <Form onSubmit={handleSubmit} css={formStyles}>
      <Form.Item label="Nazwa" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGrey }} />}
          />
        )}
      </Form.Item>
      <Form.Item label="Opis" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_desc')(
          <Input
            prefix={
              <Icon type="edit" style={{ color: Colors.SemiLightGrey }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Rodzaj" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_kind', {
          rules: [{ required: true, message: 'rodzaj jest wymagany' }],
        })(<TaskTypeRadioGroup />)}
      </Form.Item>
      <Form.Item label="Waga" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_weight', {
          rules: [{ required: true, message: 'waga jest wymagana' }],
        })(
          <Input
            type="number"
            prefix={
              <Icon type="calculator" style={{ color: Colors.SemiLightGrey }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Max liczba punktów" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_max_points', {
          rules: [{ required: true, message: 'waga jest wymagana' }],
        })(
          <Input
            type="number"
            prefix={
              <Icon type="bar-chart" style={{ color: Colors.SemiLightGrey }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Data wyników" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_results_date', {})(
          <DatePicker style={{ width: 280 }} />
        )}
      </Form.Item>
      <Flex flexDirection="row">
        <Form.Item {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('task_upload_start', {})(
            <DatePicker style={{ width: 280 }} />
          )}
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('task_upload_end', {})(
            <DatePicker style={{ width: 280 }} />
          )}
        </Form.Item>
      </Flex>
      <Form.Item label="Weryfikacja wysyłanych pilików">
        {getFieldDecorator('verify_upload', {})(<Switch defaultChecked />)}
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Dodaj
      </Button>
    </Form>
  );
};
export const WrappedNewTaskForm = Form.create()(NewTaskForm);

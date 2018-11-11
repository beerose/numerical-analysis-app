import { Button, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

import { UserDTO } from '../../../../common/api';
import { LABELS } from '../../utils/labels';
import { SelectRole } from '../SelectRole';

const FormItem = Form.Item;

type Props = {
  onSubmit: (user: UserDTO) => void;
  onCancel: () => void;
} & FormComponentProps;
const NewGroupForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values: UserDTO) => {
      if (err) {
        return;
      }
      props.onSubmit(values);
      setTimeout(() => {
        props.form.resetFields();
        // workaround for ant bug
        const selected = document.getElementsByClassName('ant-select-selection-selected-value');
        if (selected && selected[0]) {
          selected[0].innerHTML =
            '<div unselectable="on" class="ant-select-selection__placeholder" style="display: block; user-select: none;">Rola użytkownika</div>';
        }
      }, 1000);
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem>
        {getFieldDecorator('user_name', {
          rules: [{ required: true, message: LABELS.nameRequired }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={LABELS.name}
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: LABELS.emailRequired }],
        })(
          <Input
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={LABELS.email}
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('user_role', {
          rules: [{ required: true, message: LABELS.roleRequired }],
        })(<SelectRole placeholder={LABELS.role} mode="single" />)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('student_index', {
          rules: [{ required: false }],
        })(
          <Input
            prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={LABELS.optionalIndex}
          />
        )}
      </FormItem>
      <Button type="primary" htmlType="submit">
        Dodaj
      </Button>
    </Form>
  );
};

export const WrappedNewGroupForm = Form.create()(NewGroupForm);

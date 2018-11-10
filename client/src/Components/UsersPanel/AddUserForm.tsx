import { Button, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

import { UserDTO } from '../../../../common/api';
import { LABELS } from '../../utils/labels';
import { SelectRole } from '../SelectRole';

const FormItem = Form.Item;

type Props = {
  onSubmit: (user: UserDTO) => void;
} & FormComponentProps;
class NewUserForm extends React.Component<Props> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values: UserDTO) => {
      if (err) {
        return;
      }
      this.props.onSubmit(values);
    });
    setTimeout(() => this.props.form.resetFields(), 1000);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
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
          })(<SelectRole placeholder={LABELS.role} mode={'single'} />)}
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
  }
}

export const WrappedNewUserForm = Form.create()(NewUserForm);

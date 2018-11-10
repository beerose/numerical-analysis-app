import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

import { UserDTO } from '../../../../common/api';
import { userRoleOptions } from '../../utils/utils';

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
            rules: [{ required: true, message: 'Należy podać imię i nazwisko' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Imię i nazwisko"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Należy podać email' }],
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('user_role', {
            rules: [{ required: true, message: 'Należy podać rolę użytkownika' }],
          })(
            <Select placeholder="Wybierz rolę użytkownika">
              {userRoleOptions.map(o => (
                <Select.Option key={`${o}`} value={`${o}`}>
                  {o}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('student_index', {
            rules: [{ required: false }],
          })(
            <Input
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Indeks studenta (opcjonalnie)"
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

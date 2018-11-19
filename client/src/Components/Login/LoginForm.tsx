import { Button, Checkbox, Form, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { LABELS } from '../../utils/labels';
import { ModalHeader } from '../ModalHeader';

const FormItem = Form.Item;

const LoginModalHeader = <ModalHeader title={LABELS.appName} />;

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type Props = {
  onSubmit: (username: string, password: string) => void;
} & FormComponentProps;
const LoginForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values: FormValues) => {
      if (err) {
        return;
      }
      props.onSubmit(values.email, values.password);
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <Modal visible centered title={LoginModalHeader} footer={null} width={400} closable={false}>
      <Form onSubmit={handleSubmit} style={{ padding: '20px 20px 0 20px' }}>
        <FormItem validateStatus="error" help="There's no user with provided email">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: LABELS.emailRequired }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={LABELS.email}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: LABELS.passwordRequired }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={LABELS.password}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            initialValue: true,
            valuePropName: 'checked',
          })(<Checkbox>{LABELS.rememberMe}</Checkbox>)}
          <Link to="/" style={{ float: 'right' }}>
            {LABELS.forgotPassword}
          </Link>
          <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '20px' }}>
            {LABELS.logIn}
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export const WrappedLoginForm = Form.create()(LoginForm);

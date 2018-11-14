import { Button, Checkbox, Form, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

import { LABELS } from '../../utils/labels';

const FormItem = Form.Item;

const LoginTitle = () => (
  <div
    style={{
      color: 'rgba(0,0,0,.4)',
      textAlign: 'center',
    }}
  >
    {LABELS.appName}
  </div>
);

type Props = {
  visible: boolean;
} & FormComponentProps;
const LoginForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  {
    const { getFieldDecorator } = props.form;
    return (
      <Modal
        title={<LoginTitle />}
        visible={props.visible}
        footer={null}
        width={400}
        closable={false}
        centered
      >
        <Form onSubmit={handleSubmit} style={{ padding: '20px 20px 0', width: '350px' }}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Podaj swój adres email' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="adres email"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Podaj swoje hasło' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="hasło"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              initialValue: true,
              valuePropName: 'checked',
            })(<Checkbox>Pamiętaj mnie</Checkbox>)}
            <a className="login-form-forgot" href="" style={{ float: 'right' }}>
              Nie pamiętasz hasła?
            </a>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '20px' }}>
              Zaloguj się
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
};

export const WrappedLoginForm = Form.create()(LoginForm);

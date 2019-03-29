import { Button, Form, Icon, Input } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import React, { useCallback, useState } from 'react';

import { Colors, LABELS } from '../utils';
import { Flex } from '.';

const FormItem = Form.Item;

type Props = {
  onSubmit: (password: string) => void;
} & FormComponentProps;

export const NewPasswordForm = (props: Props) => {
  const [error, setError] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values._password !== values.password_confirm_) {
        setError('Hasła nie są takie same');
        return;
      }
      props.onSubmit(values.password_);
    });
  }, []);

  const { getFieldDecorator } = props.form;
  return (
    <Form
      onSubmit={handleSubmit}
      style={{ padding: '20px 20px 0', width: '350px' }}
    >
      {error && (
        <Flex justifyContent="center" color={Colors.Red} paddingBottom={10}>
          {error}
        </Flex>
      )}
      <FormItem>
        {getFieldDecorator('password_', {
          rules: [{ required: true, message: LABELS.passwordRequired }],
        })(
          <Input
            prefix={
              <Icon type="lock" style={{ color: Colors.SemiLightGrey }} />
            }
            type="password"
            placeholder="Nowe hasło"
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('password_confirm_', {
          rules: [{ required: true, message: LABELS.passwordRequired }],
        })(
          <Input
            prefix={
              <Icon type="lock" style={{ color: Colors.SemiLightGrey }} />
            }
            type="password"
            placeholder={LABELS.confirmPassword}
          />
        )}
      </FormItem>
      <Button
        type="primary"
        htmlType="submit"
        style={{ width: '100%', marginTop: '20px' }}
      >
        OK
      </Button>
    </Form>
  );
};

export const WrappedNewPasswordForm = Form.create()(NewPasswordForm);

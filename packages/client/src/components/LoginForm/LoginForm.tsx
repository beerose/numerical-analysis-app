/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Checkbox, Form, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { ModalHeader } from '../../components/ModalHeader';
import { Colors, LABELS } from '../../utils';

const FormItem = Form.Item;

const LoginModalHeader = <ModalHeader title={LABELS.appName} />;

const FormError = styled.div`
  text-align: center;
  margin-bottom: 10px;
  color: red;
`;

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type Props = {
  errorMessage?: string;
  onSubmit: (username: string, password: string, remember: boolean) => void;
} & FormComponentProps;
const LoginForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values: FormValues) => {
      if (err) {
        return;
      }
      props.onSubmit(values.email, values.password, values.remember);
    });
  };

  const {
    form: { getFieldDecorator },
    errorMessage,
  } = props;
  return (
    <Modal
      visible
      centered
      title={LoginModalHeader}
      footer={null}
      width={400}
      closable={false}
    >
      <Form
        onSubmit={handleSubmit}
        css={{ padding: '0px 20px 0 20px', alignItems: 'center' }}
      >
        {errorMessage && <FormError>{errorMessage}</FormError>}
        <FormItem validateStatus={errorMessage ? 'error' : 'validating'}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: LABELS.emailRequired }],
          })(
            <Input
              prefix={
                <Icon type="user" style={{ color: Colors.SemiLightGray }} />
              }
              placeholder={LABELS.email}
            />
          )}
        </FormItem>
        <FormItem validateStatus={errorMessage ? 'error' : 'validating'}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: LABELS.passwordRequired }],
          })(
            <Input
              prefix={
                <Icon type="lock" css={{ color: Colors.SemiLightGray }} />
              }
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
          <Link to="/forgot-password" css={{ float: 'right' }}>
            {LABELS.forgotPassword}
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            css={{ width: '100%', marginTop: '20px' }}
          >
            {LABELS.logIn}
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export const WrappedLoginForm = Form.create<Props>()(LoginForm);

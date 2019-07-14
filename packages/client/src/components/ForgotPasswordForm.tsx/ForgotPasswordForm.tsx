/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Checkbox, Form, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';

import { ModalHeader } from '../../components/ModalHeader';
import { Colors, LABELS } from '../../utils';
import { AuthStoreState } from '../../AuthStore';

const FormItem = Form.Item;

const FormModalHeader = (
  <ModalHeader title="Na Twój email zostanie wysłany link pozwalający zresetować hasło" />
);

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
  onExit: () => void;
  onSubmit: AuthStoreState['actions']['resetPassword'];
} & FormComponentProps;
const ForgotPasswordForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values: FormValues) => {
      if (err) {
        return;
      }
      props.onSubmit(values.email);
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
      destroyOnClose
      title={FormModalHeader}
      footer={null}
      width={400}
      onCancel={props.onExit}
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
        <Button
          type="primary"
          htmlType="submit"
          css={{ width: '100%', marginTop: '10px' }}
        >
          Wyślij
        </Button>
      </Form>
    </Modal>
  );
};

export const WrappedForgotPasswordForm = Form.create<Props>()(
  ForgotPasswordForm
);

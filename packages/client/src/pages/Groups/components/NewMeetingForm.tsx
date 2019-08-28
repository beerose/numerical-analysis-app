/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, DatePicker, Form, Icon, Input } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React, { useEffect } from 'react';

import { DateControls } from '../../../components/DateControls';
import { Colors } from '../../../utils';

const formStyles = css`
  padding: 25px;
`;

const formItems = css`
  width: 400px;
`;

type Props = {
  defaultDate?: Date;
  onSubmit: ({ name, date }: { name: string; date: any }) => void;
} & FormComponentProps;
const NewMeetingForm = (props: Props) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useEffect(() => {
    const currentDate = props.form.getFieldValue('date');
    if (props.defaultDate && !currentDate) {
      props.form.setFieldsValue({
        date: moment(props.defaultDate).add(7, 'days'),
      });
    }
  });

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
      <Form.Item>
        {getFieldDecorator('meeting_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            autoFocus
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGray }} />}
            placeholder="Nazwa spotkania"
            css={formItems}
          />
        )}
      </Form.Item>
      <div style={{ display: 'flex' }}>
        <Form.Item>
          {getFieldDecorator('date', {
            rules: [{ required: true, message: 'data jest wymagana' }],
          })(<DatePicker style={{ width: 280 }} />)}
        </Form.Item>
        <DateControls
          setFieldsValue={setFieldsValue}
          getFieldValue={getFieldValue}
          config={[-7, -1, 1, 7]}
        />
      </div>
      <Button type="primary" htmlType="submit">
        Dodaj
      </Button>
    </Form>
  );
};
export const WrappedNewMeetingForm = Form.create<Props>()(NewMeetingForm);

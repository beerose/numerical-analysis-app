import { Button, DatePicker, Form, Icon, Input } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import { css } from 'emotion';
import * as React from 'react';

import { DateControls } from '../../../components/DateControls';
import { Colors } from '../../../utils';

const formStyles = css`
  padding: 25px;
`;

const formItems = css`
  width: 400px;
`;

type Props = {
  onSubmit: ({ name, date }: { name: string; date: any }) => void;
} & FormComponentProps;
const NewMeetingForm = (props: Props) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

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
    <Form onSubmit={handleSubmit} className={formStyles}>
      <Form.Item>
        {getFieldDecorator('meeting_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGrey }} />}
            placeholder="Nazwa spotkania"
            className={formItems}
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
export const WrappedNewMeetingForm = Form.create()(NewMeetingForm);

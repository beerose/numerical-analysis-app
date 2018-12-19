import { Button, DatePicker, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { css } from 'emotion';
import * as React from 'react';

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
  const { getFieldDecorator } = props.form;

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
      <FormItem>
        {getFieldDecorator('meeting_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Nazwa spotkania"
            className={formItems}
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('date', {
          rules: [{ required: true, message: 'data jest wymagana' }],
        })(<DatePicker className={formItems} />)}
      </FormItem>
      <Button type="primary" htmlType="submit">
        Dodaj
      </Button>
    </Form>
  );
};
export const WrappedNewMeetingForm = Form.create()(NewMeetingForm);

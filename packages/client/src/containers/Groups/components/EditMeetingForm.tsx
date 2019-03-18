import { Button, DatePicker, Form, Icon, Input } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import { MeetingDTO } from 'common';
import { css } from 'emotion';
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
  model: MeetingDTO;
  onSubmit: (meeting: MeetingDTO) => void;
} & FormComponentProps;
const EditMeetingForm = (props: Props) => {
  useEffect(() => {
    const { model } = props;

    props.form.setFieldsValue({
      date: moment.utc(model.date),
      meeting_name: model.meeting_name,
    });
  }, [props.model]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      props.onSubmit({ id: props.model.id, ...values });
      setTimeout(() => {
        props.form.resetFields();
      }, 1000);
    });
  };

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

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

export const WrappedEditMeetingForm = Form.create()(EditMeetingForm);

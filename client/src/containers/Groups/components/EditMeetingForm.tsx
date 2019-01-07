import { Button, DatePicker, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { css } from 'emotion';
import moment from 'moment';
import * as React from 'react';

import { MeetingDTO } from 'common';
import { DateIncrementors } from '../../../components/DateIncrementors';

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
class EditMeetingForm extends React.Component<Props> {
  componentDidMount() {
    const { model } = this.props;
    this.props.form.setFieldsValue({
      date: moment(model.date),
      meeting_name: model.meeting_name,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.model !== this.props.model) {
      const { model } = nextProps;
      nextProps.form.setFieldsValue({
        date: moment(model.date),
        meeting_name: model.meeting_name,
      });
    }
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.onSubmit({ id: this.props.model.id, ...values });
      setTimeout(() => {
        this.props.form.resetFields();
      }, 1000);
    });
  };

  addDays = (value: number) => {
    const selectedDate = this.props.form.getFieldValue('date');
    if (!selectedDate) {
      this.props.form.setFieldsValue({
        date: moment(new Date()).add(value, 'days'),
      });
      return;
    }
    this.props.form.setFieldsValue({
      date: moment(selectedDate).add(value, 'days'),
    });
  };

  render() {
    const {
      getFieldDecorator,
      setFieldsValue,
      getFieldValue,
    } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className={formStyles}>
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
        <div style={{ display: 'flex' }}>
          <FormItem>
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'data jest wymagana' }],
            })(<DatePicker />)}
          </FormItem>
          <DateIncrementors
            setFieldsValue={setFieldsValue}
            getFieldValue={getFieldValue}
            config={[{ value: 1 }, { value: 7 }]}
          />
        </div>
        <Button type="primary" htmlType="submit">
          Dodaj
        </Button>
      </Form>
    );
  }
}
export const WrappedEditMeetingForm = Form.create()(EditMeetingForm);

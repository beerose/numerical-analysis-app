import { Button, Form, Icon, Input, Radio, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SelectValue } from 'antd/lib/select';
import { css } from 'emotion';
import * as React from 'react';

import { UserDTO } from '../../../../../common/api';
import { GROUPS } from '../../../../../common/groups';
import { LABELS } from '../../../utils/labels';

const FormItem = Form.Item;

const FORM_ITEM_LAYOUT = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 24 },
  },
};

const SelectSuperUser = React.forwardRef(
  (
    { superUsers, onChange }: { superUsers: UserDTO[]; onChange?: (value: SelectValue) => void },
    ref: React.Ref<Select>
  ) => (
    <Select
      showArrow
      placeholder={
        <>
          <Icon type="user" style={{ color: 'rgba(0,0,0,.25)', marginRight: '5px' }} />
          {LABELS.superUser}
        </>
      }
      onChange={onChange}
      ref={ref}
    >
      {superUsers.map(superUser => (
        <Select.Option key={superUser.id} value={superUser.id}>
          {superUser.user_name}
        </Select.Option>
      ))}
    </Select>
  )
);

export const SelectSemester = React.forwardRef(
  ({ onChange }: { onChange?: (value: SelectValue) => void }, ref: React.Ref<Select>) => (
    <Select
      showArrow
      mode="single"
      placeholder={
        <>
          <Icon type="table" style={{ color: 'rgba(0,0,0,.25)', marginRight: '5px' }} />
          Rok akademicki
        </>
      }
      onChange={onChange}
      ref={ref}
    >
      {['2018/2019', '2019'].map(o => (
        <Select.Option value={o} key={o}>
          {o}
        </Select.Option>
      ))}
    </Select>
  )
);

const formStyles = css`
  min-width: 28.5vw;

  @media (max-device-width: 680px) {
    min-width: 42vw;
  }
`;

export type NewGroupFormValues = {
  academic_year: string;
  class_room: number | string;
  group: GROUPS;
  group_name: string;
  super_user_id: string;
};

type Props = {
  superUsers: UserDTO[];
  onSubmit: (group: NewGroupFormValues) => void;
  onCancel: () => void;
} & FormComponentProps;
class NewGroupForm extends React.Component<Props> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values: NewGroupFormValues) => {
      if (err) {
        return;
      }
      this.props.onSubmit(values);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      onCancel,
      superUsers,
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} className={formStyles}>
        <FormItem label={LABELS.group} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('group', {
            rules: [{ required: true, message: LABELS.groupRequired }],
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="lecture">{LABELS.lecture}</Radio.Button>
              <Radio.Button value="exercise">{LABELS.exercise}</Radio.Button>
              <Radio.Button value="lab">{LABELS.lab}</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label={LABELS.superUser} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('super_user', {
            rules: [{ required: true, message: LABELS.nameRequired }],
          })(<SelectSuperUser superUsers={superUsers} />)}
        </FormItem>
        <FormItem label={LABELS.groupName} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('group_name', {
            rules: [{ required: true, message: LABELS.groupNameRequired }],
          })(
            <Input
              prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={LABELS.groupName}
            />
          )}
        </FormItem>
        <FormItem label={LABELS.academicYear} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('academic_year', {
            rules: [{ required: true, message: LABELS.academicYearRequired }],
          })(<SelectSemester />)}
        </FormItem>
        <FormItem label={LABELS.classRoomNumber} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('class_room')(
            <Input
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={LABELS.classRoomNumber}
            />
          )}
        </FormItem>
        <FormItem
          wrapperCol={{
            sm: { span: 16, offset: 8 },
            xs: { span: 24, offset: 0 },
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: '5px' }}>
            Dodaj
          </Button>
          <Button type="default" style={{ marginLeft: '5px' }} onClick={onCancel}>
            Anuluj
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export const WrappedNewGroupForm = Form.create()(NewGroupForm);

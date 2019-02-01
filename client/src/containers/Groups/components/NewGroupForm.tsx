import { Button, Form, Icon, Input, Radio, Select } from 'antd';
// tslint:disable: no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import { SelectValue } from 'antd/lib/select';
// tslint:enable: no-submodule-imports
import { GroupType, UserDTO } from 'common';
import { css } from 'emotion';
import * as React from 'react';

import { colors, LABELS } from '../../../utils';

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
    {
      superUsers,
      onChange,
    }: { superUsers: UserDTO[]; onChange?: (value: SelectValue) => void },
    ref: React.Ref<Select>
  ) => (
    <Select
      showArrow
      placeholder={
        <>
          <Icon type="user" style={{ color: colors.semiLightGrey, marginRight: '5px' }} />
          {LABELS.superUser}
        </>
      }
      onChange={onChange}
      ref={ref}
    >
      {superUsers.map(superUser => (
        <Select.Option key={String(superUser.id)} value={superUser.id}>
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
          <Icon
            type="table"
            style={{ color: colors.semiLightGrey, marginRight: '5px' }}
          />
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
  width: 420px;
`;

export type NewGroupFormValues = {
  academic_year: string;
  class_room: number | string;
  group: GroupType;
  group_name: string;
  lecturer_id: UserDTO['id'];
};

type Props = {
  superUsers: UserDTO[];
  onSubmit: (group: NewGroupFormValues) => void;
  onCancel: () => void;
  loading: boolean;
} & FormComponentProps;
class NewGroupForm extends React.Component<Props> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ submitting: true });
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
      loading,
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
          {getFieldDecorator('lecturer_id', {
            rules: [{ required: true, message: LABELS.nameRequired }],
          })(<SelectSuperUser superUsers={superUsers} />)}
        </FormItem>
        <FormItem label={LABELS.groupName} {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator('group_name', {
            rules: [{ required: true, message: LABELS.groupNameRequired }],
          })(
            <Input
              prefix={<Icon type="tags" style={{ color: colors.semiLightGrey }} />}
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
              prefix={<Icon type="book" style={{ color: colors.semiLightGrey }} />}
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
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: '5px' }}
            loading={loading}
          >
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

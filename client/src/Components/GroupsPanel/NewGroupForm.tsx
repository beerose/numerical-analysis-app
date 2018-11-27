import { Button, Col, Form, Icon, Input, Radio, Row, Select, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SelectValue } from 'antd/lib/select';
import { css } from 'emotion';
import * as React from 'react';

import { UserDTO } from '../../../../common/api';
import { ROLES } from '../../../../common/roles';
import { usersService } from '../../api';
import { LABELS } from '../../utils/labels';

const FormItem = Form.Item;

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

type State = {
  superUsers: UserDTO[];
};
type Props = {
  onSubmit: () => void;
  onCancel: () => void;
} & FormComponentProps;
class NewGroupForm extends React.Component<Props, State> {
  state = {
    superUsers: [] as UserDTO[],
  };

  componentWillMount() {
    usersService.listUsers({ roles: ROLES.superUser }).then(res => {
      this.setState({ superUsers: res.users });
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      this.props.onSubmit();
      setTimeout(() => {
        this.props.form.resetFields();
        // workaround for ant bug
        const selected = document.getElementsByClassName('ant-select-selection-selected-value');
        if (selected && selected[0]) {
          selected[0].innerHTML =
            '<div unselectable="on" class="ant-select-selection__placeholder" style="display: block; user-select: none;">Rola użytkownika</div>';
        }
      }, 1000);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        xs: { span: 24 },
      },
      wrapperCol: {
        sm: { span: 16 },
        xs: { span: 24 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} className={formStyles}>
        <FormItem label={LABELS.group} {...formItemLayout}>
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
        <FormItem label={LABELS.superUser} {...formItemLayout}>
          {getFieldDecorator('super_user', {
            rules: [{ required: true, message: LABELS.nameRequired }],
          })(<SelectSuperUser superUsers={this.state.superUsers} />)}
        </FormItem>
        <FormItem label={LABELS.groupName} {...formItemLayout}>
          {getFieldDecorator('group_name', {
            rules: [{ required: true, message: LABELS.groupNameRequired }],
          })(
            <Input
              prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={LABELS.groupName}
            />
          )}
        </FormItem>
        <FormItem label={LABELS.academicYear} {...formItemLayout}>
          {getFieldDecorator('academic_year', {
            rules: [{ required: true, message: LABELS.academicYearRequired }],
          })(<SelectSemester />)}
        </FormItem>
        <FormItem label={LABELS.classRoomNumber} {...formItemLayout}>
          {getFieldDecorator('class_room', {
            rules: [{ required: true, message: LABELS.classRoomNumberRequired }],
          })(
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
          <Button type="default" style={{ marginLeft: '5px' }} onClick={this.props.onCancel}>
            Anuluj
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export const WrappedNewGroupForm = Form.create()(NewGroupForm);

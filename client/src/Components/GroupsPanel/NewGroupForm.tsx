import { Button, Col, Form, Icon, Input, Row, Select, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { css } from 'emotion';
import * as React from 'react';

import { UserDTO } from '../../../../common/api';
import { ROLES } from '../../../../common/roles';
import { usersService } from '../../api';
import { LABELS } from '../../utils/labels';

const FormItem = Form.Item;

const SelectSuperUser = React.forwardRef(
  ({ superUsers }: { superUsers: UserDTO[] }, ref: React.Ref<Select>) => (
    <Select
      showArrow
      placeholder={
        <>
          <Icon type="user" style={{ color: 'rgba(0,0,0,.25)', marginRight: '5px' }} />
          {LABELS.superUser}
        </>
      }
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

const SelectSemester = React.forwardRef(({}, ref: React.Ref<Select>) => (
  <Select
    showArrow
    placeholder={
      <>
        <Icon type="table" style={{ color: 'rgba(0,0,0,.25)', marginRight: '5px' }} />
        {LABELS.semester}
      </>
    }
    ref={ref}
  >
    <Select.Option key={'letni'} value={'letni'}>
      Letni 2018
    </Select.Option>
    <Select.Option key={'zimowy'} value={'zimowy'}>
      Zimowy 2017/2018
    </Select.Option>
  </Select>
));

const SelectDay = React.forwardRef(({}, ref: React.Ref<Select>) => (
  <Select
    showArrow
    placeholder={
      <>
        <Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)', marginRight: '5px' }} />
        {LABELS.classDay}
      </>
    }
    ref={ref}
  >
    {LABELS.weekdays.map(day => (
      <Select.Option key={day} value={day}>
        {day}
      </Select.Option>
    ))}
  </Select>
));

const formStyles = css`
  width: 30vw;

  @media (max-device-width: 680px) {
    width: 60vw;
  }

  .ant-time-picker {
    width: 100% !important;
  }
`;

const timePickerStyles = css`
  @media (max-device-width: 680px) {
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
    this.props.onSubmit();
    // this.context.router.history.push('/some/Path');
    this.props.form.validateFields((err, values: UserDTO) => {
      if (err) {
        return;
      }

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

    return (
      <Form onSubmit={this.handleSubmit} className={formStyles}>
        <FormItem>
          {getFieldDecorator('super_user', {
            rules: [{ required: true, message: LABELS.nameRequired }],
          })(<SelectSuperUser superUsers={this.state.superUsers} />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('semester', {
            rules: [{ required: true, message: LABELS.semesterRequired }],
          })(<SelectSemester />)}
        </FormItem>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('class_day', {
                rules: [{ required: true, message: LABELS.classDayRequired }],
              })(<SelectDay />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('class_time', {
                rules: [{ required: true, message: LABELS.classTimeRequired }],
              })(
                <TimePicker
                  className={timePickerStyles}
                  format="HH:mm"
                  minuteStep={15}
                  placeholder={LABELS.classTime}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          {getFieldDecorator('class_room', {
            rules: [{ required: true, message: LABELS.classRoomNumberRequired }],
          })(
            <Input
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={LABELS.classRoomNumber}
            />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit">
          Dodaj
        </Button>
      </Form>
    );
  }
}

export const WrappedNewGroupForm = Form.create()(NewGroupForm);

import { Button, Divider, Form, Icon, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import styled from 'styled-components';

import { UserDTO } from '../../../../../common/api';
import { LABELS } from '../../../utils/labels';

const FormItem = Form.Item;

const RemoveSelectedStudent = styled(Icon)`
  padding: 5px;
  cursor: pointer;
  * {
    fill: red;
  }
`;

type State = {
  selectedStudent?: UserDTO;
};
type Props = {
  onSubmit: (user: UserDTO) => void;
  onCancel: () => void;
  visible: boolean;
  allStudents: UserDTO[];
} & FormComponentProps;
export class NewStudentModalForm extends React.Component<Props, State> {
  state = {
    selectedStudent: undefined,
  };
  getFieldDecorator = this.props.form.getFieldDecorator;

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values: UserDTO) => {
      if (err) {
        return;
      }
      this.props.onSubmit(values);
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

  handleSelectChange = (value: string) => {
    const { allStudents } = this.props;
    this.setState({ selectedStudent: allStudents.find(s => s.id === value) });
  };

  clearSelectedStudent = () => {
    this.setState({ selectedStudent: undefined });
  };

  render() {
    const { selectedStudent } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        title={LABELS.newUser}
        onCancel={this.props.onCancel}
        footer={null}
      >
        <p>{LABELS.selectFromListOrCreate}</p>
        <Select
          showSearch
          style={{ width: 300 }}
          placeholder={LABELS.selectFromList}
          optionFilterProp="children"
          onChange={this.handleSelectChange}
          filterOption={(input, option) =>
            option.props.children &&
            option.props.children
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.props.allStudents.map(student => (
            <Select.Option value={student.id}>{student.user_name}</Select.Option>
          ))}
        </Select>
        {selectedStudent && (
          <RemoveSelectedStudent type="close-circle" onClick={this.clearSelectedStudent} />
        )}
        <Divider />
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {this.getFieldDecorator('user_name', {
              rules: [{ required: true, message: LABELS.nameRequired }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={LABELS.name}
                disabled={!!this.state.selectedStudent}
              />
            )}
          </FormItem>
          <FormItem>
            {this.getFieldDecorator('email', {
              rules: [{ required: true, message: LABELS.emailRequired }],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={LABELS.email}
                disabled={!!this.state.selectedStudent}
              />
            )}
          </FormItem>
          <FormItem>
            {this.getFieldDecorator('student_index', {
              rules: [{ required: false }],
            })(
              <Input
                prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={LABELS.index}
                disabled={!!this.state.selectedStudent}
              />
            )}
          </FormItem>
          <Button type="primary" htmlType="submit">
            Dodaj
          </Button>
        </Form>
      </Modal>
    );
  }
}

export const WrappedNewStudentModalForm = Form.create()(NewStudentModalForm);

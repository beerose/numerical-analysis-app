/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Divider, Form, Icon, Input, Modal, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import { UserDTO } from 'common';
import * as React from 'react';

import { RemoveSelected } from '../../../components/RemoveSelected';
import { Colors, findStringifiedLowercase, LABELS } from '../../../utils';

const FormItem = Form.Item;

type State = {
  selectedStudent?: UserDTO;
};
type Props = {
  onSubmit: (user: UserDTO) => void;
  onCancel: () => void;
  visible: boolean;
  allStudents: UserDTO[];
} & FormComponentProps;
export class AddStudentForm extends React.Component<Props, State> {
  state: State = {};
  getFieldDecorator = this.props.form.getFieldDecorator;

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { selectedStudent } = this.state;
    if (selectedStudent) {
      this.props.onSubmit(selectedStudent);
      setTimeout(() => this.setState({ selectedStudent: undefined }), 1000);
      return;
    }

    this.props.form.validateFields((err, values: UserDTO) => {
      if (err) {
        return;
      }
      this.props.onSubmit(values);
      setTimeout(() => {
        this.props.form.resetFields();
      }, 1000);
    });
  };

  handleSelectChange = (value: string) => {
    const { allStudents } = this.props;
    this.setState({
      selectedStudent:
        allStudents.find(s => s.id === Number(value)) || undefined,
    });
  };

  clearSelectedStudent = () => {
    this.setState({ selectedStudent: undefined });
  };

  render() {
    const { selectedStudent } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        title="Nowy student"
        onCancel={this.props.onCancel}
        footer={null}
      >
        <p>{LABELS.selectFromListOrCreate}</p>
        <Select
          showSearch
          value={
            selectedStudent &&
            `(${selectedStudent.student_index || ''}) ${
              selectedStudent.user_name
            }`
          }
          css={{ width: 300 }}
          placeholder={LABELS.selectFromList}
          optionFilterProp="children"
          onChange={this.handleSelectChange}
          filterOption={findStringifiedLowercase}
        >
          {this.props.allStudents.map(student => (
            <Select.Option key={`${student.id}`} value={student.id}>
              {`[${student.student_index || ''}] ${student.user_name}`}
            </Select.Option>
          ))}
        </Select>
        {selectedStudent && (
          <RemoveSelected
            type="close-circle"
            onClick={this.clearSelectedStudent}
          />
        )}
        <Divider />
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {this.getFieldDecorator('user_name', {
              rules: [{ required: true, message: LABELS.nameRequired }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: Colors.SemiLightGray }} />
                }
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
                prefix={
                  <Icon type="mail" style={{ color: Colors.SemiLightGray }} />
                }
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
                prefix={
                  <Icon type="book" style={{ color: Colors.SemiLightGray }} />
                }
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

export const WrappedNewStudentModalForm = Form.create<Props>()(AddStudentForm);

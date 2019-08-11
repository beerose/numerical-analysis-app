import { Input } from 'antd';
import Form, { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { UserDTO } from 'common';
import * as React from 'react';

import { SelectRole } from '../../components/SelectRole';
import { LABELS } from '../../utils/labels';

import { EditableConsumer, EditableProvider } from './Context';

interface EditableRowProps
  extends FormComponentProps,
    React.ComponentProps<'tr'> {}
const EditableRow = ({ form, ...props }: EditableRowProps) => (
  <EditableProvider value={form}>
    <tr {...props} />
  </EditableProvider>
);

export const EditableFormRow = Form.create()(EditableRow);

const requiredFields = ['user_name', 'email', 'user_role'];

type EditableCellProps = {
  editing: boolean;
  dataIndex: never;
  record: UserDTO;
  required: boolean;
  title: string;
  options?: string[];
};
export class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    if (this.props.options) {
      return (
        <SelectRole mode="single" initialValue={this.props.record.user_role} />
      );
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      required,
      record,
      title,
      ...restProps
    } = this.props;
    return (
      <EditableConsumer>
        {(form: WrappedFormUtils) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                    rules: [
                      {
                        message: LABELS.requiredField,
                        required: requiredFields.find(f => f === dataIndex)
                          ? true
                          : false,
                      },
                    ],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableConsumer>
    );
  }
}

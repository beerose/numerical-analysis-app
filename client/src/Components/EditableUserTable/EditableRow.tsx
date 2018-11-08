import * as React from 'react';
import Form, { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { Input, Select } from 'antd';
import { LABELS } from '../../utils/labels';

export const { Provider: EditableProvider, Consumer: EditableConsumer } = React.createContext({});

const EditableRow = ({ form, ...props }: FormComponentProps) => (
  <EditableProvider value={form}>
    <tr {...props} />
  </EditableProvider>
);

export const EditableFormRow = Form.create()(EditableRow);

type EditableCellProps = {
  editing: boolean;
  dataIndex: never;
  record: string[];
  title: string;
  options?: string[];
};
export class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    if (this.props.options) {
      const options = this.props.options.map(o => (
        <Select.Option key={`${o}`} value={`${o}`}>
          {o}
        </Select.Option>
      ));
      return <Select style={{ width: 120 }}>{options}</Select>;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, record, title, ...restProps } = this.props;
    return (
      <EditableConsumer>
        {(form: WrappedFormUtils) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: LABELS.requiredField,
                      },
                    ],
                    initialValue: record[dataIndex],
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

import * as React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { EditableConsumer } from './Context';
import { Input, Select } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

type EditableCellProps = {
  editing: boolean;
  dataIndex: never;
  record: string[];
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
    const { editing, dataIndex, record, ...restProps } = this.props;
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

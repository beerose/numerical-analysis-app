import * as React from "react";
import { Table, Input, Form, Button, Select } from "antd";
import { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import { css } from "react-emotion";

const newRowButtonStyles = css`
  margin: 20px 20px 20px 0;
`;

type User = {
  key: string;
  name: string;
  email: string;
  role: string;
  index?: string;
};
const data: User[] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    email: `edward@${i}.com`,
    role: i % 2 === 0 ? "superUser" : "student",
  });
}
const FormItem = Form.Item;
const EditableContext = React.createContext({});

const EditableRow = ({ form, ...props }: FormComponentProps) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

type EditableCellProps = {
  editing: boolean;
  dataIndex: never;
  record: string[];
  options?: string[];
};
class EditableCell extends React.Component<EditableCellProps> {
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
      <EditableContext.Consumer>
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
      </EditableContext.Consumer>
    );
  }
}

type UsersTableState = {
  data: User[];
  editingKey: string;
};
export class UsersTable extends React.Component<{}, UsersTableState> {
  state = { data, editingKey: "" };
  columns = [
    {
      title: "Imię i nazwisko",
      dataIndex: "name",
      width: "25%",
      editable: true,
      required: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      editable: true,
    },
    {
      title: "Index",
      dataIndex: "index",
      width: "15%",
      editable: true,
    },
    {
      title: "Rola",
      dataIndex: "role",
      width: "15%",
      editable: true,
      options: ["admin", "superUser", "student"],
    },
    {
      dataIndex: "edit",
      width: "auto",
      render: (_: any, record: { key: string }) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <a onClick={() => this.cancelEdit()}>Cancel</a>
              </span>
            ) : (
              <a onClick={() => this.edit(record.key)}>Edytuj</a>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "delete",
      width: "auto",
      render: (_: any, record: { key: string }) => {
        return (
          <EditableContext.Consumer>
            {form => (
              <a
                href="javascript:;"
                onClick={() => this.delete(record.key)}
                style={{ marginRight: 8 }}
              >
                Usuń
              </a>
            )}
          </EditableContext.Consumer>
        );
      },
    },
  ];

  isEditing = ({ key }: { key: string }) => {
    return key === this.state.editingKey;
  };

  edit(key: string) {
    this.setState({ editingKey: key });
  }

  save(form: object, key: string) {
    // form.validateFields((error, row) => {
    //   console.log(row);
    // });
    this.setState({ editingKey: "" });
  }

  delete(key: string) {
    const newData = this.state.data.filter(i => key !== i.key);
    this.setState({ data: newData });
  }

  cancelEdit() {
    this.setState({ editingKey: "" });
  }

  addNewUser() {
    const { data } = this.state;
    const newRow = {
      key: data.length.toString(),
      name: "",
      email: "",
      index: "",
      role: "",
    };
    this.setState({
      data: [newRow, ...data],
      editingKey: data.length.toString(),
    });
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: { key: string }) => ({
          record,
          dataIndex: col.dataIndex,
          options: col.options,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <>
        <Button
          type="default"
          icon="user-add"
          onClick={() => this.addNewUser()}
          className={newRowButtonStyles}
        >
          Nowy użytkownik
        </Button>
        <Table
          components={components}
          dataSource={this.state.data}
          columns={columns}
        />
      </>
    );
  }
}

import * as React from 'react';
import styled, { css } from 'react-emotion';
import {
  Button,
  Form,
  Table,
  Upload
  } from 'antd';
import { EditableCell } from './EditableCell';
import { EditableProvider } from './Context';
import { FormComponentProps } from 'antd/lib/form/Form';
import { UserDTO } from '../../api/userApiDTO';

const buttonStyles = css`
  margin: 20px 20px 20px 0;
`;

const ActionLink = styled('a')`
  margin-right: 8px;
`;

const EditableRow = ({ form, ...props }: FormComponentProps) => (
  <EditableProvider value={form}>
    <tr {...props} />
  </EditableProvider>
);

const EditableFormRow = Form.create()(EditableRow);

type TableColumn = {
  dataIndex: string;
  title?: string;
  width?: string;
  options?: string[];
  editable?: boolean;
  required?: boolean;
  render?: any;
};
const tableColumns: TableColumn[] = [
  {
    title: 'Imię i nazwisko',
    dataIndex: 'user_name',
    width: '25%',
    editable: true,
    required: false,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '15%',
    editable: true,
  },
];

type ExtraColumnTypes = 'role' | 'index';

const extraTableColumns: Record<ExtraColumnTypes, TableColumn> = {
  role: {
    title: 'Rola',
    dataIndex: 'user_role',
    width: '15%',
    editable: true,
    options: ['admin', 'superUser', 'student'],
  },
  index: {
    title: 'Index',
    dataIndex: 'index',
    width: '15%',
    editable: true,
  },
};

const getExtraColumnsForRender = (extraColumns: ExtraColumnTypes[] = []) =>
  extraColumns.map(column => extraTableColumns[column]);

type UsersTableState = {
  data: UserDTO[];
  editingKey: string;
};
type UsersTableProps = {
  users: UserDTO[];
  extraColumns?: ExtraColumnTypes[];
};
export class UsersTable extends React.Component<UsersTableProps, UsersTableState> {
  state = { data: [] as UserDTO[], editingKey: '' };
  columns: TableColumn[] = [
    ...tableColumns,
    ...getExtraColumnsForRender(this.props.extraColumns),
    {
      dataIndex: 'edit',
      render: (_: any, record: UserDTO) => {
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <ActionLink onClick={() => this.save(record)}>Save</ActionLink>
            <ActionLink onClick={this.cancelEdit}>Cancel</ActionLink>
          </span>
        ) : (
          <ActionLink onClick={() => this.edit(record.email)}>Edytuj</ActionLink>
        );
      },
    },
    {
      dataIndex: 'delete',
      render: (_: any, record: { email: string }) => {
        return <ActionLink onClick={() => this.delete(record.email)}>Usuń</ActionLink>;
      },
    },
  ];

  componentWillReceiveProps(nextProps: UsersTableProps) {
    this.setState({ data: nextProps.users });
  }

  isEditing = ({ email }: UserDTO) => {
    return email === this.state.editingKey;
  };

  edit(email: string) {
    this.setState({ editingKey: email });
  }

  save(record: any) {
    console.log(record);
    // form.validateFields((error, row) => {
    //   console.log(row);
    // });
    this.setState({ editingKey: '' });
  }

  delete(email: string) {
    const newData = this.state.data.filter(i => email !== i.email);
    this.setState({ data: newData });
  }

  cancelEdit = () => {
    this.setState({ editingKey: '' });
  };

  addNewUser() {
    const { data } = this.state;
    const newRow = {
      user_name: '',
      email: '',
      index: '',
      user_role: '',
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
        onCell: (record: UserDTO) => ({
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
          className={buttonStyles}
        >
          Nowy użytkownik
        </Button>
        <Upload accept="text/csv" showUploadList={false}>
          <Button type="default" icon="upload" className={buttonStyles}>
            CSV Upload
          </Button>
        </Upload>
        <Table rowKey="id" components={components} dataSource={this.state.data} columns={columns} />
      </>
    );
  }
}

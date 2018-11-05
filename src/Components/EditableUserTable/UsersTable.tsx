import * as React from 'react';
import styled from 'react-emotion';
import { Table } from 'antd';
import { EditableCell, EditableFormRow } from './EditableRow';
import { LABELS } from '../../utils/labels';
import { UserDTO } from '../../api/userApiDTO';
import { userRoleOptions } from '../../utils/utils';

const ActionLink = styled('a')`
  margin-right: 8px;
`;

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
    options: userRoleOptions,
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
            <ActionLink onClick={() => this.save(record)}>{LABELS.save}</ActionLink>
            <ActionLink onClick={this.cancelEdit}>{LABELS.cancel}</ActionLink>
          </span>
        ) : (
          <ActionLink onClick={() => this.edit(record.email)}>{LABELS.edit}</ActionLink>
        );
      },
    },
    {
      dataIndex: 'delete',
      render: (_: any, record: { email: string }) => {
        return <ActionLink onClick={() => this.delete(record.email)}>{LABELS.delete}</ActionLink>;
      },
    },
  ];

  validateRecord = (record: UserDTO) => record.email && record.user_name && record.user_role;

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
      <Table
        style={{ wordWrap: 'initial' }}
        rowKey="id"
        components={components}
        dataSource={this.state.data}
        columns={columns}
      />
    );
  }
}

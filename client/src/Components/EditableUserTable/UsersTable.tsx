import { Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import * as React from 'react';
import styled from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { LABELS } from '../../utils/labels';
import { userRoleOptions } from '../../utils/utils';

import { EditableConsumer } from './Context';
import { EditableCell, EditableFormRow } from './EditableRow';

const ActionLink = styled('a')`
  margin-right: 8px;
`;

type TableColumn = {
  dataIndex: string;
  title?: string;
  width?: string;
  options?: string[];
  editable?: boolean;
  render?: any;
};
const tableColumns: TableColumn[] = [
  {
    dataIndex: 'user_name',
    editable: true,
    title: 'Imię i nazwisko',
    width: '25%',
  },
  {
    dataIndex: 'email',
    editable: true,
    title: 'Email',
    width: '15%',
  },
];

type ExtraColumnTypes = 'role' | 'index';
const extraTableColumns: Record<ExtraColumnTypes, TableColumn> = {
  index: {
    dataIndex: 'student_index',
    editable: true,
    title: 'Indeks',
    width: '15%',
  },
  role: {
    dataIndex: 'user_role',
    editable: true,
    options: userRoleOptions,
    title: 'Rola',
    width: '15%',
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
  onUpdate: (user: UserDTO) => void;
  onDelete: (id: string) => void;
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
            <EditableConsumer>
              {(form: WrappedFormUtils) => (
                <ActionLink onClick={() => this.handleUpdate(form, record.id)}>
                  {LABELS.save}
                </ActionLink>
              )}
            </EditableConsumer>
            <ActionLink onClick={this.handleCancelEdit}>{LABELS.cancel}</ActionLink>
          </span>
        ) : (
          <ActionLink onClick={() => this.handleEdit(record.email)}>
            {LABELS.edit}
          </ActionLink>
        );
      },
      width: '10%',
    },
    {
      dataIndex: 'delete',
      render: (_: any, record: UserDTO) => {
        return (
          <ActionLink onClick={() => this.handleDelete(record.id)}>
            {LABELS.delete}
          </ActionLink>
        );
      },
      width: '10%',
    },
  ];

  componentWillReceiveProps(nextProps: UsersTableProps) {
    this.setState({ data: nextProps.users });
  }

  isEditing = ({ email }: UserDTO) => {
    return email === this.state.editingKey;
  };

  handleEdit(email: string) {
    this.setState({ editingKey: email });
  }

  handleCancelEdit = () => {
    this.setState({ editingKey: '' });
  };

  handleUpdate(form: WrappedFormUtils, id: string) {
    form.validateFields((_, row) => {
      this.props.onUpdate({ id, ...row });
    });
    this.setState({ editingKey: '' });
  }

  handleDelete(id: string) {
    this.props.onDelete(id);
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
        row: EditableFormRow,
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
          editing: this.isEditing(record),
          options: col.options,
          title: col.title,
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

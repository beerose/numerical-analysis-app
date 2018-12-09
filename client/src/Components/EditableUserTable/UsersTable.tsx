import { Popconfirm, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import styled from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { userRoleOptions } from '../../../../common/roles';
import { LABELS } from '../../utils/labels';

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
    width: '350px',
  },
  {
    dataIndex: 'email',
    editable: true,
    title: 'Email',
    width: '350px',
  },
];

type ExtraColumnTypes = 'role' | 'index';
const extraTableColumns: Record<ExtraColumnTypes, TableColumn> = {
  index: {
    dataIndex: 'student_index',
    editable: true,
    title: 'Indeks',
    width: '250px',
  },
  role: {
    dataIndex: 'user_role',
    editable: true,
    options: userRoleOptions,
    title: 'Rola',
    width: '160px',
  },
};

const getExtraColumnsForRender = (extraColumns: ExtraColumnTypes[] = []) =>
  extraColumns.map(column => extraTableColumns[column]);

type UsersTableState = {
  currentPage: number;
  data: UserDTO[];
  editingKey: string;
};
type UsersTableProps = {
  pageSize: number;
  showPagination: boolean;
  currentPage?: number;
  users: UserDTO[];
  total?: number;
  extraColumns?: ExtraColumnTypes[];
  onUpdate: (user: UserDTO) => void;
  onDelete: (id: string) => void;
  onTableChange?: (cfg: PaginationConfig) => void;
  style?: React.CSSProperties;
};
export class UsersTable extends React.Component<UsersTableProps, UsersTableState> {
  state = { data: this.props.users, editingKey: '', currentPage: 1 };
  columns: TableColumn[] = [
    ...tableColumns,
    ...getExtraColumnsForRender(this.props.extraColumns),
    {
      dataIndex: 'edit',
      render: (_: any, record: UserDTO) => {
        const editable = this.isEditing(record);
        return editable ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100px' }}>
            <EditableConsumer>
              {(form: WrappedFormUtils) => (
                <ActionLink onClick={() => this.handleUpdate(form, record.id!)}>
                  {LABELS.save}
                </ActionLink>
              )}
            </EditableConsumer>
            <ActionLink onClick={this.handleCancelEdit}>{LABELS.cancel}</ActionLink>
          </div>
        ) : (
          <ActionLink onClick={() => this.handleEdit(record.email)}>{LABELS.edit}</ActionLink>
        );
      },
    },
    {
      dataIndex: 'delete',
      render: (_: any, record: UserDTO) => {
        return (
          <Popconfirm
            title={LABELS.areYouSure}
            onConfirm={() => this.handleDelete(record.id!)}
            okText={LABELS.yes}
            okType="danger"
            placement="topRight"
            cancelText={LABELS.no}
          >
            <ActionLink>{LABELS.delete}</ActionLink>
          </Popconfirm>
        );
      },
    },
  ];

  componentWillReceiveProps(nextProps: UsersTableProps) {
    this.setState({ data: nextProps.users, currentPage: nextProps.currentPage || 1 });
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

    const paginationConfig = {
      current: this.state.currentPage,
      pageSize: this.props.pageSize,
      superSimple: true,
      total: this.props.total,
    };

    return (
      <Table
        size="small"
        rowKey="id"
        components={components}
        dataSource={this.state.data}
        columns={columns}
        pagination={this.props.showPagination ? paginationConfig : false}
        onChange={this.props.onTableChange}
        style={this.props.style}
      />
    );
  }
}

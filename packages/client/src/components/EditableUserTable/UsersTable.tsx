/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Popconfirm, Table, Tooltip } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { WrappedFormUtils } from 'antd/lib/form/Form';
// tslint:disable-next-line:no-submodule-imports
import { PaginationConfig } from 'antd/lib/table';
import { UserDTO, userRoleOptions, UserId } from 'common';
import * as React from 'react';

import { LABELS } from '../../utils/labels';

import { EditableConsumer } from './Context';
import { EditableCell, EditableFormRow } from './EditableRow';

const ActionLink = styled('a')`
  margin-right: 8px;
  color: ${props => props.color && 'red'};
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
    width: '200px',
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
  editingKey: string;
  shouldShowPlaceholder: boolean;
};
type UsersTableProps = {
  pageSize?: number;
  showPagination: boolean;
  currentPage?: number;
  users: UserDTO[];
  total?: number;
  extraColumns?: ExtraColumnTypes[];
  onUpdate: (user: UserDTO) => void;
  hideEdit?: boolean;
  onDelete: (id: UserId) => void;
  onSendInvitation: (
    user: Pick<UserDTO, 'email' | 'user_name' | 'user_role'>
  ) => void;
  hideDelete?: boolean;
  onTableChange?: (cfg: PaginationConfig) => void;
  className?: string;
};

const components = {
  body: {
    cell: EditableCell,
    row: EditableFormRow,
  },
};

export class UsersTable extends React.Component<
  UsersTableProps,
  UsersTableState
> {
  state: UsersTableState = {
    currentPage: 1,
    editingKey: '',
    shouldShowPlaceholder: false,
  };

  timeoutId?: number;

  columns: TableColumn[] = [
    ...tableColumns,
    ...getExtraColumnsForRender(this.props.extraColumns),
    {
      dataIndex: 'edit',
      render: (_: any, record: UserDTO) => {
        const editable = this.isEditing(record);
        return (
          !this.props.hideEdit &&
          (editable ? (
            <div
              style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100px' }}
            >
              <EditableConsumer>
                {(form: WrappedFormUtils) => (
                  <ActionLink
                    onClick={() => this.handleUpdate(form, record.id)}
                  >
                    {LABELS.save}
                  </ActionLink>
                )}
              </EditableConsumer>
              <ActionLink onClick={() => this.setState({ editingKey: '' })}>
                {LABELS.cancel}
              </ActionLink>
            </div>
          ) : (
            <ActionLink
              onClick={() => this.setState({ editingKey: record.email })}
            >
              {LABELS.edit}
            </ActionLink>
          ))
        );
      },
    },
    {
      dataIndex: 'delete',
      render: (_: any, record: UserDTO) => {
        return (
          !this.props.hideDelete && (
            <Popconfirm
              title={LABELS.areYouSure}
              onConfirm={() => this.props.onDelete(record.id)}
              okText={LABELS.yes}
              okType="danger"
              placement="topRight"
              cancelText={LABELS.no}
            >
              <ActionLink>{LABELS.delete}</ActionLink>
            </Popconfirm>
          )
        );
      },
    },
    {
      dataIndex: 'invitation',
      render: (_: any, record: UserDTO) => {
        return record.active_user ? null : (
          <Popconfirm
            title={
              <div style={{ width: 300 }}>
                Użytkownik nie jest aktywny, ale prawodpodobnie dostał już maila
                aktywującego konto, podczas dodawania go do systemu. Jeśli nie,
                możesz wysłać ponownie.
              </div>
            }
            onConfirm={() => this.props.onSendInvitation(record)}
            okText="wyslij"
            okType="danger"
            placement="topRight"
            cancelText="anuluj"
          >
            <ActionLink color="red">zaproś</ActionLink>
          </Popconfirm>
        );
      },
    },
  ];

  isEditing = ({ email }: UserDTO) => {
    return email === this.state.editingKey;
  };

  handleUpdate(form: WrappedFormUtils, id: UserId) {
    form.validateFields((_, row) => {
      this.props.onUpdate({ id, ...row });
    });
    this.setState({ editingKey: '' });
  }

  componentDidMount() {
    /**
     * We want to avoid placeholder blink
     */
    this.timeoutId = window.setTimeout(() => {
      this.setState({ shouldShowPlaceholder: true });
      this.timeoutId = undefined;
    });
  }

  componentWillMount() {
    if (typeof this.timeoutId === 'number') {
      window.clearTimeout(this.timeoutId);
    }
  }

  render() {
    const {
      onTableChange,
      showPagination,
      pageSize,
      total,
      className,
      users,
      currentPage,
    } = this.props;
    const { shouldShowPlaceholder } = this.state;

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
      pageSize,
      total,
      current: currentPage,
      superSimple: true,
    };

    return (
      <Table
        size="small"
        rowKey="id"
        components={components}
        dataSource={users}
        columns={columns}
        pagination={showPagination ? paginationConfig : false}
        onChange={onTableChange}
        className={className}
        css={
          !shouldShowPlaceholder
            ? css`
                .ant-table-placeholder {
                  opacity: 0;
                }
              `
            : css`
                .ant-table-placeholder {
                  transition: opacity 250ms linear;
                }
              `
        }
      />
    );
  }
}

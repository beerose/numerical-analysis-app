import { css } from '@emotion/core';
import { Table as AntTable } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { TableProps } from 'antd/lib/table';

const tableStylesFixes = css`
  th.ant-table-fixed-columns-in-body.ant-table-column-sort {
    background-color: rgb(250, 250, 250);
  }
  td.ant-table-fixed-columns-in-body.ant-table-column-sort {
    background-color: transparent;
  }

  .ant-table-fixed-columns-in-body {
    > div {
      width: 80px;
      visibility: hidden;
    }
    pointer-events: none;
    color: transparent;
    user-select: none;
  }

  .ant-table-body {
    overflow: auto;
  }

  .ant-table {
    width: auto;
  }

  .ant-table-scroll table {
    min-width: auto;
  }
`;

export function Table<T>(props: TableProps<T>) {
  return (
    <AntTable
      {...props}
      css={
        props.className ? [tableStylesFixes, props.className] : tableStylesFixes
      }
    />
  );
}

// tslint:disable-next-line:no-namespace
export namespace Table {
  export const Column = AntTable.Column;
  export const ColumnGroup = AntTable.ColumnGroup;
}

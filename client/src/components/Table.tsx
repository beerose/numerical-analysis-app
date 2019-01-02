/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Table as AntTable } from 'antd';
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
`;

// We usually want to have arrows, but i don't want to say <T extends any>
// tslint:disable-next-line:function-name
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

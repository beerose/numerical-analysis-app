import * as React from "react";
import { Input, Button, Select } from "antd";
import { UsersTable } from "./UsersTable";
import styled, { css } from "react-emotion";

const SearchPanel = styled("div")`
  margin: 20px 0 20px 0;
  display: flex;
`;

const inputStyles = css`
  width: 25vw;
  margin-right: 10px;
`;

export const UsersPanelContainer = () => (
  <>
    <SearchPanel>
      <Input
        placeholder="Szukaj według imienia, nazwiska lub indeksu"
        className={inputStyles}
      />
      <Select
        mode="multiple"
        className={inputStyles}
        placeholder="Szukaj według roli użytkownika"
      >
        <Select.Option key={"admin"}>admin</Select.Option>
        <Select.Option key={"student"}>student</Select.Option>
        <Select.Option key={"pracownik"}>pracownik</Select.Option>
      </Select>
      <Button shape="circle" icon="search" />
    </SearchPanel>
    <UsersTable />
  </>
);

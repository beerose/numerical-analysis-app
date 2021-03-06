import styled from '@emotion/styled';
import { Button, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SelectableSubtask, TaskDTO } from 'common';
import React, { useEffect, useState } from 'react';

import { Flex } from '../../../components';
import { Colors } from '../../../utils';

const emptyMessage = ' ';

const StyledDeleteIcon = styled(Icon)`
  cursor: pointer;
  position: absolute;
  left: 550px;
  margin-top: 10px;
  font-size: 24px;
  color: ${Colors.SemiLightGray};
  transition: all 0.3s;

  &:hover {
    color: ${Colors.Gray};
  }
`;

const StyledInput = styled(Input)`
  width: 55px;
  margin: 5px 10px 0px 5px;
`;

const ChoosableTaskContainer = styled(Flex)`
  padding: 6px 0px 8px 6px;
  margin-bottom: 10px;
  border: 1px solid ${Colors.SemiLightGray};
  width: 540px;
  overflow-x: scroll;
  max-height: 57px;
`;

export type ChoosableFormFields = {
  subtask_id: number[];
  subtask_group_capacity: number[];
  subtask_max_groups: number[];
};

let id = 0;
type Props = FormComponentProps & { model?: TaskDTO; mode: 'create' | 'edit' };
export const DynamicChoosableTasksForm = ({ model, form, mode }: Props) => {
  const [keys, setKeys] = useState<number[]>([]);
  const [subtasks, setSubtasks] = useState<
    Array<
      | SelectableSubtask
      | {
          id?: number;
          group_capacity?: number;
          max_groups?: number;
        }
    >
  >([]);
  const { getFieldDecorator } = form;

  useEffect(() => {
    if (model && model.data && mode === 'edit') {
      id = subtasks ? model.data.choosable_subtasks.length : 0;
      setSubtasks(model.data.choosable_subtasks);
      setKeys(
        Array.from(new Array(model.data.choosable_subtasks.length).keys())
      );
    }
  }, [model]);

  const add = () => {
    setSubtasks(prev => prev.concat([{}]));
    // tslint:disable-next-line:no-increment-decrement
    setKeys(prev => prev.concat(id++));
    window.scrollTo(0, document.body.scrollHeight);
  };

  const remove = (k: number) => {
    if (keys.length === 0) {
      return;
    }

    setSubtasks(prev => prev.filter((_t, i) => i !== k));
    setKeys(prev => prev.filter((key: number) => key !== k));
  };

  const formItems = keys.map((k: number) => (
    <ChoosableTaskContainer key={k}>
      Numer zadania:
      <Form.Item style={{ margin: 0, padding: 0 }}>
        {getFieldDecorator(`subtask_id[${k}]`, {
          initialValue: (subtasks[k] && subtasks[k].id) || k,
          rules: [
            {
              message: emptyMessage,
              required: true,
            },
          ],
        })(<StyledInput type="number" />)}
      </Form.Item>
      Rozmiar zespołu:
      <Form.Item style={{ margin: 0, padding: 0 }}>
        {getFieldDecorator(`subtask_group_capacity[${k}]`, {
          initialValue: (subtasks[k] && subtasks[k].group_capacity) || 1,
          rules: [
            {
              message: emptyMessage,
              required: true,
            },
          ],
        })(<StyledInput type="number" />)}
      </Form.Item>
      Liczba zespołów:
      <Form.Item style={{ margin: 0, padding: 0 }}>
        {getFieldDecorator(`subtask_max_groups[${k}]`, {
          initialValue: (subtasks[k] && subtasks[k].max_groups) || 1,
          rules: [
            {
              message: emptyMessage,
              required: true,
            },
          ],
        })(<StyledInput type="number" />)}
      </Form.Item>
      <StyledDeleteIcon type="minus-circle-o" onClick={() => remove(k)} />
    </ChoosableTaskContainer>
  ));
  return (
    <>
      {formItems}
      <Button type="dashed" onClick={add} style={{ width: '60%' }}>
        <Icon type="plus" /> Dodaj nowe
      </Button>
    </>
  );
};

import { Form, Icon, Input, Button } from 'antd';
import React, { useState } from 'react';
import { ChoosableSubtask } from 'common';
import styled from '@emotion/styled';

import { Flex } from '../../../components';
import { Colors } from '../../../utils';
import { FormComponentProps } from 'antd/lib/form';

const StyledDeleteIcon = styled(Icon)`
  cursor: pointer;
  position: absolute;
  left: 490px;
  margin-top: 10px;
  font-size: 24px;
  color: ${Colors.SemiLightGrey};
  transition: all 0.3s;

  &:hover {
    color: ${Colors.Grey};
  }
`;

const StyledInput = styled(Input)`
  width: 50px;
  margin: 5px 10px 0px 5px;
`;

const ChoosableTaskContainer = styled(Flex)`
  padding: 6px 0px 8px 6px;
  margin-bottom: 10px;
  border: 1px solid ${Colors.SemiLightGrey};
  width: 480px;
  overflow-x: scroll;
`;

let id = 0;
type Props = FormComponentProps;
export const DynamicChoosableTasksForm = (props: Props) => {
  const add = () => {
    const { form } = props;

    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);

    form.setFieldsValue({
      keys: nextKeys,
    });

    window.scrollTo(0, document.body.scrollHeight);
  };

  const remove = (k: number) => {
    const { form } = props;
    const keys = form.getFieldValue('keys');

    if (keys.length === 0) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter((key: number) => key !== k),
    });
  };

  const { getFieldDecorator, getFieldValue } = props.form;
  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k: number) => (
    <ChoosableTaskContainer key={k}>
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(`subtask_id[${k}]`, {
          rules: [
            {
              required: true,
            },
          ],
        })(
          <>
            Numer zadania:
            <StyledInput />
          </>
        )}
      </Form.Item>
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(`subtask_group_capacity[${k}]`, {
          rules: [
            {
              required: true,
            },
          ],
        })(
          <>
            Liczność grupy:
            <StyledInput />
          </>
        )}
      </Form.Item>
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(`subtask_max_groups[${k}]`, {
          rules: [
            {
              required: true,
            },
          ],
        })(
          <>
            Ilość grup:
            <StyledInput />
          </>
        )}
      </Form.Item>
      <StyledDeleteIcon type="minus-circle-o" onClick={() => remove(k)} />
    </ChoosableTaskContainer>
  ));
  return (
    <>
      {formItems}
      <Form.Item>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> Dodaj nowe
        </Button>
      </Form.Item>
    </>
  );
};

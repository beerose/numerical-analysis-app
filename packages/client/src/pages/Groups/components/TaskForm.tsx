/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, DatePicker, Form, Icon, Input, Switch } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Omit } from 'react-router';

import {
  ChoosableSubtask,
  TaskDTO,
  TaskKind,
} from '../../../../../../dist/common';
import { TaskTypeSelect } from '../../../components';
import { Colors, showMessage } from '../../../utils';

import {
  ChoosableFormFields,
  DynamicChoosableTasksForm,
} from './DynamicChoosableTasksForm';
import { StartEndDatePicker } from './StartEndDatePicker';

const smallInputStyles = css`
  width: 100px !important;
`;

const formStyles = css`
  margin-left: 0px;
  margin-top: 20px;
  min-width: 700px;
  margin-bottom: 50px;
`;

const FORM_ITEM_LAYOUT = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 16 },
  },
};

type Props = {
  mode: 'edit' | 'create';
  model?: TaskDTO;
  onSubmit: (values: TaskDTO) => void;
} & FormComponentProps;

// tslint:disable-next-line:no-big-function
const TaskForm = (props: Props) => {
  const { getFieldDecorator } = props.form;
  const [taskType, setTaskType] = useState<TaskKind | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields(
      (
        err,
        values: Omit<TaskDTO, 'name' | 'data'> & {
          task_name: TaskDTO['name'];
        } & ChoosableFormFields
      ) => {
        if (err) {
          showMessage({ error: 'Wypełnij wszystkie pola' });
          return;
        }
        const choosable: ChoosableSubtask[] = [];
        if (values.subtask_id) {
          values.subtask_id.map((v, i) => {
            choosable.push({
              group_capacity: values.subtask_group_capacity[i],
              id: v,
              max_groups: values.subtask_max_groups[i],
            });
          });
        }
        props.onSubmit({
          data: { choosable_subtasks: choosable },
          description: values.description,
          end_upload_date: values.end_upload_date,
          id: values.id,
          kind: values.kind,
          max_points: Number(values.max_points),
          name: values.task_name,
          results_date: values.results_date,
          start_upload_date: values.start_upload_date,
          verify_upload: Boolean(values.verify_upload),
          weight: Number(values.weight),
        });
      }
    );
  };

  useEffect(() => {
    if (props.mode === 'edit' && props.model) {
      const task = props.model;
      setTaskType(task.kind);
      props.form.setFieldsValue({
        description: task.description,
        kind: task.kind,
        max_points: task.max_points,
        results_date: moment(task.results_date),
        task_name: task.name,
        weight: task.weight,
      });
      if ([TaskKind.Assignment, TaskKind.Homework].includes(task.kind)) {
        props.form.setFieldsValue({
          end_upload_date: moment(task.end_upload_date),
          start_upload_date: moment(task.start_upload_date),
          verify_upload: task.verify_upload,
        });
      }
    }
  }, [props.model]);

  return (
    <Form onSubmit={handleSubmit} css={formStyles}>
      <Form.Item label="Rodzaj zadania" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('kind', {
          rules: [{ required: true, message: 'rodzaj jest wymagany' }],
        })(
          <TaskTypeSelect
            onSelect={val => {
              setTaskType(val as TaskKind);
            }}
          />
        )}
      </Form.Item>
      <Form.Item label="Nazwa" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('task_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGray }} />}
          />
        )}
      </Form.Item>
      <Form.Item label="Opis" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('description')(
          <Input
            prefix={
              <Icon type="edit" style={{ color: Colors.SemiLightGray }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Waga" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('weight', {
          rules: [{ required: true, message: 'waga jest wymagana' }],
        })(
          <Input
            type="number"
            css={smallInputStyles}
            prefix={
              <Icon type="calculator" style={{ color: Colors.SemiLightGray }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Max liczba punktów" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('max_points', {
          rules: [{ required: true, message: 'waga jest wymagana' }],
        })(
          <Input
            type="number"
            css={smallInputStyles}
            prefix={
              <Icon type="bar-chart" style={{ color: Colors.SemiLightGray }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Data wyników" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('results_date', {})(
          <DatePicker
            css={css`
              width: 180px;
            `}
          />
        )}
      </Form.Item>
      {[TaskKind.Assignment, null].includes(taskType) && (
        <section>
          <StartEndDatePicker
            required
            layout={FORM_ITEM_LAYOUT}
            getFieldDecorator={getFieldDecorator}
            label="Terminy oddawania zadania"
            startKey="start_upload_date"
            endKey="end_upload_date"
          />
          <StartEndDatePicker
            required
            layout={FORM_ITEM_LAYOUT}
            getFieldDecorator={getFieldDecorator}
            label="Terminy głosowania na zadanie"
            startKey="start_vote_date"
            endKey="end_vote_date"
          />
          <Form.Item
            label="Weryfikacja wysyłanych pilików"
            {...FORM_ITEM_LAYOUT}
          >
            {getFieldDecorator('verify_upload', {
              initialValue: true,
            })(<Switch defaultChecked={true} />)}
          </Form.Item>
          <Form.Item label="Wybieralne zadania" {...FORM_ITEM_LAYOUT}>
            <DynamicChoosableTasksForm {...props} />
          </Form.Item>
        </section>
      )}
      <Button type="primary" htmlType="submit" style={{ width: '100px' }}>
        Zapisz
      </Button>
    </Form>
  );
};
export const WrappedTaskForm = Form.create<Props>()(TaskForm);

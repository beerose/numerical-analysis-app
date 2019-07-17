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
import { TaskKindSelect } from '../../../components';
import { Colors, showMessage } from '../../../utils';

import {
  ChoosableFormFields,
  DynamicChoosableTasksForm,
} from './DynamicChoosableTasksForm';
import { RequiredText, StartEndDatePicker } from './StartEndDatePicker';

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

interface FormModel
  extends ChoosableFormFields,
    Omit<
      TaskDTO,
      | 'end_upload_date'
      | 'end_vote_date'
      | 'start_upload_date'
      | 'start_vote_date'
      | 'name'
      | 'data'
    > {
  task_name: string;
  upload_dates: [Date, Date];
  vote_dates: [Date, Date];
}

type Props = {
  mode: 'edit' | 'create';
  model?: TaskDTO;
  onSubmit: (values: TaskDTO) => void;
} & FormComponentProps<FormModel>;

// tslint:disable-next-line:no-big-function
const TaskForm = (props: Props) => {
  const { getFieldDecorator } = props.form;
  const [taskType, setTaskType] = useState<TaskKind | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
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
        // tslint:disable:object-literal-sort-keys
        id: values.id,
        description: values.description,
        kind: values.kind,
        max_points: Number(values.max_points),
        name: values.task_name,
        results_date: values.results_date,
        start_upload_date: values.upload_dates[0],
        end_upload_date: values.upload_dates[1],
        verify_upload: Boolean(values.verify_upload),
        weight: Number(values.weight),
        start_vote_date: values.vote_dates[0],
        end_vote_date: values.vote_dates[1],
        data: { choosable_subtasks: choosable },
      });
    });
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
          upload_dates: [
            moment(task.start_upload_date),
            moment(task.end_upload_date),
          ],
          vote_dates: [
            moment(task.start_vote_date),
            moment(task.end_vote_date),
          ],
          verify_upload: task.verify_upload,
        });
      }
    }
  }, [props.model]);

  return (
    <Form onSubmit={handleSubmit} css={formStyles}>
      <Form.Item label="Rodzaj zadania" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator<FormModel>('kind', {
          rules: [{ required: true, message: 'rodzaj jest wymagany' }],
        })(
          <TaskKindSelect
            onSelect={val => {
              setTaskType(val as TaskKind);
            }}
          />
        )}
      </Form.Item>
      <Form.Item label="Nazwa" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator<FormModel>('task_name', {
          rules: [{ required: true, message: 'nazwa jest wymagana' }],
        })(
          <Input
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGray }} />}
          />
        )}
      </Form.Item>
      <Form.Item label="Opis" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator<FormModel>('description')(
          <Input
            prefix={
              <Icon type="edit" style={{ color: Colors.SemiLightGray }} />
            }
          />
        )}
      </Form.Item>
      <Form.Item label="Waga" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator<FormModel>('weight', {
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
        {getFieldDecorator<FormModel>('max_points', {
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
        {getFieldDecorator<FormModel>('results_date', {})(
          <DatePicker
            css={css`
              width: 180px;
            `}
          />
        )}
      </Form.Item>
      {[TaskKind.Assignment, null].includes(taskType) && (
        <section>
          <Form.Item
            label={'Terminy głosowania na zadanie'}
            {...FORM_ITEM_LAYOUT}
            required
            css={css`
              padding: 0;
              margin: 0;
            `}
          >
            {getFieldDecorator<FormModel>('vote_dates', {})(
              <DatePicker.RangePicker />
            )}
          </Form.Item>
          <Form.Item
            label={'Terminy oddawania zadania'}
            {...FORM_ITEM_LAYOUT}
            required
            css={css`
              padding: 0;
              margin: 0;
            `}
          >
            {getFieldDecorator<FormModel>('upload_dates', {})(
              <DatePicker.RangePicker />
            )}
          </Form.Item>
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

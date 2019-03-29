/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, DatePicker, Form, Icon, Input, Switch } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Omit } from 'react-router';

import { TaskDTO, TaskKind } from '../../../../../../dist/common';
import { TaskTypeSelect } from '../../../components';
import { Colors, showMessage } from '../../../utils';
import { DynamicChoosableTasksForm } from '.';

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
// tslint:disable-next-line:max-func-body-length
const TaskForm = (props: Props) => {
  const { getFieldDecorator } = props.form;
  const [taskType, setTaskType] = useState<TaskKind | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.form.validateFields(
      (err, values: Omit<TaskDTO, 'name'> & { task_name: TaskDTO['name'] }) => {
        if (err) {
          showMessage({ error: 'Wypełnij wszystkie pola' });
          return;
        }
        props.onSubmit({
          ...values,
          max_points: Number(values.max_points),
          name: values.task_name,
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
            prefix={<Icon type="tag" style={{ color: Colors.SemiLightGrey }} />}
          />
        )}
      </Form.Item>
      <Form.Item label="Opis" {...FORM_ITEM_LAYOUT}>
        {getFieldDecorator('description')(
          <Input
            prefix={
              <Icon type="edit" style={{ color: Colors.SemiLightGrey }} />
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
              <Icon type="calculator" style={{ color: Colors.SemiLightGrey }} />
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
              <Icon type="bar-chart" style={{ color: Colors.SemiLightGrey }} />
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
          <Form.Item
            label={
              <span>
                <span
                  css={css`
                    color: red;
                  `}
                >
                  *
                </span>{' '}
                Terminy oddawania zadania
              </span>
            }
            {...FORM_ITEM_LAYOUT}
            css={css`
              padding: 0;
              margin: 0;
            `}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              style={{ display: 'inline-block', maxWidth: '180px' }}
            >
              {getFieldDecorator('start_upload_date', {
                rules: [{ required: true, message: 'pole jest wymagane' }],
              })(
                <DatePicker
                  css={css`
                    width: 180px;
                  `}
                />
              )}
            </Form.Item>
            <span
              style={{
                padding: '10px',
                textAlign: 'center',
                width: '24px',
              }}
            >
              -
            </span>

            <Form.Item
              {...FORM_ITEM_LAYOUT}
              style={{ display: 'inline-block' }}
            >
              {getFieldDecorator('end_upload_date', {
                rules: [{ required: true, message: 'pole jest wymagane' }],
              })(
                <DatePicker
                  css={css`
                    width: 180px;
                  `}
                />
              )}
            </Form.Item>
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
export const WrappedTaskForm = Form.create()(TaskForm);

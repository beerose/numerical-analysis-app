import { Button } from 'antd';
import { css } from 'emotion';
import moment from 'moment';
import * as React from 'react';

const dateSelectorsStyles = css`
  color: rgba(0, 0, 0, 0.5);
  font-size: 90%;
  margin-left: 10px;
  margin-top: 5px;
`;

type Props = {
  getFieldValue: (s: string) => any;
  setFieldsValue: (o: object) => void;
  config: Array<{
    value: number;
    label?: string;
  }>;
};

export const DateIncrementors = (props: Props) => {
  const onSelectorClick = (value: number) => {
    const selectedDate = props.getFieldValue('date');
    if (!selectedDate) {
      props.setFieldsValue({ date: moment(new Date()).add(value, 'days') });
      return;
    }
    props.setFieldsValue({ date: moment(selectedDate).add(value, 'days') });
  };

  return (
    <>
      {props.config.map(s => (
        <Button
          key={s.value}
          shape="circle"
          onClick={() => onSelectorClick(s.value)}
          className={dateSelectorsStyles}
        >
          {s.label ? s.label : `+${s.value}`}
        </Button>
      ))}
    </>
  );
};

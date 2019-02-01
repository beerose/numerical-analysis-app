import { Button } from 'antd';
import { css } from 'emotion';
import moment from 'moment';
import * as React from 'react';

const dateSelectorsStyles = css`
  color: rgba(0, 0, 0, 0.5);
  font-size: 90%;
  margin-left: 5px;
  margin-top: 4px;
  width: 30px;
  height: 30px;
`;

const containerStyles = css`
  width: 100%;
`;

type Config = {
  value: number;
  decr?: boolean;
  label?: string;
};

type Props = {
  getFieldValue: (s: string) => any;
  setFieldsValue: (o: object) => void;
  config: Config[];
};

export const DateIncrementors = (props: Props) => {
  const onSelectorClick = (config: Config) => {
    const selectedDate = props.getFieldValue('date');
    const defaultDate = selectedDate ? moment(selectedDate) : moment(new Date());
    props.setFieldsValue({ date: defaultDate.add(config.value, 'days') });
  };

  return (
    <div className={containerStyles}>
      {props.config.map(s => (
        <Button
          key={s.value}
          shape="circle"
          onClick={() => onSelectorClick(s)}
          className={dateSelectorsStyles}
        >
          {s.label ? s.label : s.decr ? `${s.value}` : `+${s.value}`}
        </Button>
      ))}
    </div>
  );
};

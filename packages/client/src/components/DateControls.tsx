import { Button } from 'antd';
import { css } from 'emotion';
import moment from 'moment';
import React, { useCallback } from 'react';

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

type Props = {
  getFieldValue: (s: string) => any;
  setFieldsValue: (o: object) => void;
  config: number[];
};

export const DateControls = (props: Props) => {
  const onSelectorClick = (days: number) => {
    const selectedDate = props.getFieldValue('date');
    const defaultDate = selectedDate
      ? moment(selectedDate)
      : moment(new Date());
    props.setFieldsValue({ date: defaultDate.add(days, 'days') });
  };

  return (
    <div className={containerStyles}>
      {props.config.map(days => (
        <Button
          key={days}
          shape="circle"
          onClick={() => onSelectorClick(days)}
          className={dateSelectorsStyles}
        >
          {days > 0 && '+'}
          {days}
        </Button>
      ))}
    </div>
  );
};
